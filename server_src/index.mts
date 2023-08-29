import { createServer } from "http";
import { inspect } from "util";
import { Server as SocketIOServer, Socket } from "socket.io";
import { ClientToServerEvents, InterServerEvents, MeetingsMetadata, ServerToClientEvents, SocketData } from "./message_formats.mjs";


const meetingsMetadata: MeetingsMetadata = {};
let idToNames: { [id: string]: string } = {};
const httpServer = createServer();
const socketIOServer = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
httpServer.listen(process.argv[2] || 3000);
httpServer.on("listening", () => console.log(`server listening on: ${inspect(httpServer.address(), { depth: null, colors: true })}`))
socketIOServer.on("connection", (socket) => {
  socket.emit("available_meetings", meetingsMetadata);

  socket.on("name", name => {
    if (Object.values(idToNames).find(nameInUse => nameInUse == name)) {
      socket.emit("name_already_taken_error", name);
      return;
    }
    idToNames[socket.id] = name;
    socketIOServer.emit("names", idToNames);
    socket.emit("name_changed", name);
  });
  socket.on("new_meeting", (meetingName, meetingDescription) => {
    if (meetingAlreadyExists(meetingName)) {
      socket.emit("meeting_already_exists_error", meetingName);
      return;
    }
    socket.join(meetingName);
    meetingsMetadata[meetingName] = {
      description: meetingDescription,
      number_of_participants: 1
    }
    console.log("Meeting " + meetingName + " has been created");
    socketIOServer.emit("available_meetings", meetingsMetadata);
    console.log("Client ID " + socket.id + " created meeting " + meetingName);
    socket.emit("created", meetingName,);
    socket.emit("joined", meetingName, socket.id);
  });

  socket.on("join_meeting", (meetingName) => {
    console.log("meta: ", meetingsMetadata, " query: ", meetingName)
    if (!meetingAlreadyExists(meetingName)) {
      socket.emit("meeting_doesnt_exist_error", meetingName);
      return;
    }
    socket.join(meetingName);
    console.log("Client ID " + socket.id + " joined meeting " + meetingName);
    console.log("Meeting " + meetingName + " now has " + getMeetingParticipants(meetingName)?.size + " participants");
    meetingsMetadata[meetingName].number_of_participants++;
    socketIOServer.emit("available_meetings", meetingsMetadata);
    socketIOServer.to(meetingName).emit("joined", meetingName, socket.id);
  });

  socket.on("offer", (meetingName, socketId, offer) => {
    if (!meetingAlreadyExists(meetingName)) {
      socket.emit("meeting_doesnt_exist_error", meetingName);
      return;
    }
    console.log("Client ID " + socket.id + " has offered to " + socketId + " in meeting: " + meetingName);
    socketIOServer.sockets.sockets.get(socketId)?.emit("offer", meetingName, offer, socket.id);
  });

  socket.on("answer", (meetingName, socketId, answer) => {
    if (!meetingAlreadyExists(meetingName)) {
      socket.emit("meeting_doesnt_exist_error", meetingName);
      return;
    }
    console.log("Client ID " + socket.id + " has connected with " + socketId + " in meeting: " + meetingName);
    socketIOServer.sockets.sockets.get(socketId)?.emit("answer", meetingName, answer, socket.id);
  });
  socket.on("candidate", (meetingName, socketId, candidate) => {
    console.log("Client ID " + socket.id + " has broadcasted their ice candidate" + " to " + socketId);
    socketIOServer.sockets.sockets.get(socketId)?.emit("candidate", meetingName, candidate, socket.id);
  });
  socket.on("disconnecting", (reason) => {
    delete idToNames[socket.id];
    socket.rooms.forEach(room => {
      if (meetingsMetadata[room]) meetingsMetadata[room].number_of_participants--;
      if (!(meetingsMetadata[room]?.number_of_participants)) delete meetingsMetadata[room];
    })
    socketIOServer.emit("names", idToNames);
    socketIOServer.emit("available_meetings", meetingsMetadata);
    socketIOServer.emit("disconnected", socket.id);
    console.log(socket.id + " left the building");
  });

  socket.on("exit", (meeting: string) => {
    socket.leave(meeting);
    if (meetingsMetadata[meeting]) meetingsMetadata[meeting].number_of_participants--;
    if (!(meetingsMetadata[meeting]?.number_of_participants)) delete meetingsMetadata[meeting];
  socketIOServer.emit("available_meetings", meetingsMetadata);
  socket.to(meeting).emit("exited", meeting, socket.id);
  console.log(socket.id + " left the meeting: " + meeting);
});})


function meetingAlreadyExists(meetingName: string) {
  const meeting = socketIOServer.sockets.adapter.rooms.get(meetingName);
  return !!(meeting && meeting.size);
}
function getMeetingParticipants(meetingName: string) {
  return socketIOServer.sockets.adapter.rooms.get(meetingName);
}

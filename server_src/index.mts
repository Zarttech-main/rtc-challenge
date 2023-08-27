import { createServer } from "http";
import { inspect } from "util";
import { Server as SocketIOServer } from "socket.io";
import { ClientToServerEvents, InterServerEvents, MeetingsMetadata, ServerToClientEvents, SocketData } from "./message_formats.mjs";


const meetingsMetadata : MeetingsMetadata = {};
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
  });

  socket.on("join", (meetingName, offer) => {
    if (!meetingAlreadyExists(meetingName)) {
      socket.emit("meeting_doesnt_exist_error", meetingName);
      return;
    }
    socket.join(meetingName);
    console.log("Client ID " + socket.id + " joined meeting " + meetingName);
    console.log("Meeting " + meetingName + " now has " + getMeetingParticipants(meetingName)?.size + "participants");
    meetingsMetadata[meetingName].number_of_participants++;
    socketIOServer.emit("available_meetings", meetingsMetadata);
    socketIOServer.to(meetingName).emit("offer", meetingName, offer, socket.id);
  });

  socket.on("answer", (meetingName, socketId, answer) => {
    if (!meetingAlreadyExists(meetingName)) {
      socket.emit("meeting_doesnt_exist_error", meetingName);
      return;
    }
    console.log("Client ID " + socket.id + " has connected with " + socketId + " in meeting: " + meetingName);
    socketIOServer.sockets.sockets.get(socketId)?.emit("answer", meetingName, answer, socket.id);
  });
  
  socket.on("candidate", (candidate) => {
    console.log("Client ID " + socket.id + " has broadcasted their ice candidate");
    socket.broadcast.emit("candidate", candidate);
  });
});

function meetingAlreadyExists(meetingName: string) {
  return !!(socketIOServer.sockets.adapter.rooms.get(meetingName));
}
function getMeetingParticipants(meetingName: string) {
  return socketIOServer.sockets.adapter.rooms.get(meetingName);
}

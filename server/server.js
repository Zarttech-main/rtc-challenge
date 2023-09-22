const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const Meeting = require("./Meeting");

// Express app
const app = express();

// Enable cross origin
app.use(cors());

// Create http server
const httpServer = app.listen(4000, () => {
  console.log("Server listening to port 4000...");
});

// Create websocket server
const io = new Server(httpServer, {
  // Set cross orgin access for localhost 3000 where client is hosted
  cors: {
    origin: ["http://localhost:3000"],
  },
});

// All meetings in server
const allMeetings = [];

io.on("connection", (socket) => {
  console.log(socket.id + " connected to the server...");

  socket.displayName = "";
  socket.currentMeeting;

  function disconnectSocketFromMeeting() {
    if (socket.currentMeeting) {
      // Remove sockets  meetings display name is in
      socket.currentMeeting.removeFromRoom(socket.displayName);

      // Emit this so all clients will update their meeting data
      io.emit("newMeetingCreated", { allMeetings });

      // Emit leaving event to everyone in the meeting room
      socket.currentMeeting.allMembers.forEach((displayName) => {
        if (displayName === socket.displayName) return;
        io.to(displayName + socket.currentMeeting.meetingID).emit(
          "userLeavingMeeting",
          {
            displayName: socket.displayName,
            newMeetingObj: socket.currentMeeting,
          }
        );
      });
    }
  }

  // Emit initialization
  socket.emit("initialization", { allMeetings }, (userMeetingDisplayNames) => {
    Object.keys(userMeetingDisplayNames).forEach((meetingTitle) => {
      // Get meeting
      const meeting = allMeetings.find(
        (meeting) => meeting.title === meetingTitle
      );

      if (!meeting) return;

      // Socket joins specific meeting room
      socket.join(userMeetingDisplayNames[meetingTitle] + meeting.meetingID);
    });
  });

  //   On meeting creation event
  socket.on("meetingCreation", (data) => {
    const newMeetingRoom = new Meeting({
      creatorID: data.displayName,
      title: data.meetingTitle,
    });

    // Meeting creator joins a specific room which will be used to listen for room join requests
    socket.join(data.displayName + newMeetingRoom.meetingID);

    // Add new meeting room
    allMeetings.push(newMeetingRoom);

    io.emit("newMeetingCreated", { allMeetings });
  });

  socket.on("creatorJoinsMeeting", (data) => {
    const meeting = allMeetings.find(
      (meeting) => meeting.meetingID === data.meeting.meetingID
    );

    meeting.addToRoom(data.displayName);

    socket.join(meeting.meetingID);

    // Emit this so all clients will update their meeting data
    io.emit("newMeetingCreated", { allMeetings });

    socket.currentMeeting = meeting;

    socket.displayName = data.displayName;
  });

  socket.on("meetingJoinRequest", (data) => {
    // Send join request to meeting creator
    socket
      .to(data.meeting.creatorID + data.meeting.meetingID)
      .emit("newUserJoinRequestToCreator", {
        displayName: data.displayName,
        meeting: data.meeting,
      });

    // Socket joins a particular room to receive events spcifically from that room
    socket.join(data.displayName + data.meeting.meetingID);
  });

  socket.on("accessToMeetingGranted", (data) => {
    const meeting = allMeetings.find(
      (meeting) => meeting.meetingID === data.meeting.meetingID
    );

    meeting.addToRoom(data.displayName);

    // Join meeting room
    socket.join(meeting.meetingID);

    // Emit this so all clients will update their meeting data
    io.emit("newMeetingCreated", { allMeetings });

    // Send join meeting event to the person access was granted to
    socket.to(data.displayName + data.meeting.meetingID).emit("joinMeeting", {
      meeting,
      displayName: data.displayName,
    });
  });

  socket.on("sendSignalDataToMeeting", (data) => {
    const meeting = allMeetings.find(
      (meeting) => meeting.meetingID === data.meeting.meetingID
    );

    // Send signal data to all meeting members except yourself
    socket
      .to(data.userToSignal + data.meeting.meetingID)
      .emit("signalReceived", {
        signalData: data.signalData,
        displayName: data.displayName,
      });

    socket.currentMeeting = meeting;
    socket.displayName = data.displayName;
  });

  socket.on("returnSignalToIncomingMember", (data) => {
    socket
      .to(data.displayName + data.meeting.meetingID)
      .emit("finalPeerHandshake", { ...data });
  });

  // On socket choosing to leave meeting
  socket.on("leavingMeeting", disconnectSocketFromMeeting);

  // On user disconnecting from socket server
  socket.on("disconnecting", disconnectSocketFromMeeting);
});

import React from "react";
import { useMeetingState } from "../../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../../utils/Socket/SocketProvider";

const useInit = () => {
  // Get socket object
  const socket = useSocket();

  const {
    currentMeeting,
    setCurrentMeeting,
    setMeetingNewMember,
    meetingDisplayNames,
    meetingRooms,
    setMeetingRooms,
  } = useMeetingState();

  // User creating meeting state
  const [creatingMeeting, setCreatingMeeting] = React.useState(false);

  // User joining meeting state
  const [joiningMeeting, setJoiningMeeting] = React.useState(false);

  const [meetingToJoin, setMeetingToJoin] = React.useState();

  React.useEffect(() => {
    // Execute this only if socket object has being created
    if (socket) {
      // Get necessary information as initialization of home
      socket.on("initialization", (data, ackFn) => {
        setMeetingRooms(data.allMeetings);
        ackFn(meetingDisplayNames);
      });

      // On new meetings getting created, update meeting rooms
      socket.on("newMeetingCreated", (data) => {
        setMeetingRooms(data.allMeetings);
      });

      // On getting an event to join a meeting
      socket.on("joinMeeting", (data) => {
        if (currentMeeting) {
          alert(`Acess to ${data.meeting.title} granted`);

          return;
        }

        // Set meeting as current meeting
        setCurrentMeeting(data.meeting);

        // An identifier for the peer initialization
        setMeetingNewMember(true);
      });
    }

    return () => {
      socket.off("joinMeeting");
    };

    // eslint-disable-next-line
  }, [socket, currentMeeting]);

  return {
    meetingRooms,
    creatingMeeting,
    setCreatingMeeting,
    joiningMeeting,
    setJoiningMeeting,
    meetingToJoin,
    setMeetingToJoin,
  };
};

export default useInit;

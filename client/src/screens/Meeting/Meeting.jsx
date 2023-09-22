import React from "react";
import Camera from "./components/Camera";
import LeaveMeeting from "./components/LeaveMeeting";
import Microphone from "./components/Microphone";
import Media from "./components/Media";
import usePeer from "./hooks/usePeer";
import { useMeetingState } from "../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../utils/Socket/SocketProvider";
import EnableAccessToMeeting from "./components/EnableAccessToMeeting";
import PartnerMedia from "./components/PartnerMedia";

function Meeting() {
  const socket = useSocket();

  const { currentMeeting } = useMeetingState();

  const { setUserStream, peers, userStream } = usePeer();
  const userMediaRef = React.useRef();

  const [joinRoomRequests, setJoinRoomRequests] = React.useState({});

  // Request for permission to media devices
  React.useEffect(() => {
    currentMeeting &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setUserStream(stream);
          userMediaRef.current.srcObject = stream;
        });
  }, [currentMeeting, setUserStream]);

  React.useEffect(() => {
    // Listen for a user join request event if you're a meeting room owner
    socket.on("newUserJoinRequestToCreator", (data) => {
      setJoinRoomRequests((prevState) => {
        const meetingRoomJoinRequests = prevState[data.meeting.meetingID];
        if (meetingRoomJoinRequests) {
          meetingRoomJoinRequests.push(data.displayName);
        } else {
          prevState[data.meeting.meetingID] = [data.displayName];
        }

        return { ...prevState };
      });
    });
  }, [socket]);

  return (
    currentMeeting && (
      <main className="flex flex-col items-center w-full h-full overflow-hidden pb-[2rem]">
        {/* Call grid */}
        <div
          className="flex-grow grid gap-[1rem] w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
          }}
        >
          {/* User media display */}
          <Media mediaRef={userMediaRef} muted={true} />

          {/* All other users media display */}
          {Object.values(peers).map((peer, index) => {
            return <PartnerMedia peer={peer} key={index} />;
          })}
        </div>

        {/* User Controls */}
        <div className="shrink-0 flex gap-[10rem] items-center py-[1rem] px-[10rem] rounded-full bg-primary-card-background">
          {/* Microphone control */}
          <Microphone userStream={userStream} />

          {/* Camera control */}
          <Camera userStream={userStream} />

          {/* Leave Meeting */}
          <LeaveMeeting />
        </div>

        {Boolean(joinRoomRequests[currentMeeting.meetingID]?.length) && (
          <>
            {joinRoomRequests[currentMeeting.meetingID].map(
              (requesterDisplayName) => (
                <EnableAccessToMeeting
                  currentMeeting={currentMeeting}
                  displayName={requesterDisplayName}
                  setJoinRoomRequests={setJoinRoomRequests}
                />
              )
            )}
          </>
        )}
      </main>
    )
  );
}

export default Meeting;

import React from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useMeetingState } from "../../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../../utils/Socket/SocketProvider";

function JoinMeetingForm(props) {
  const [displayName, setDisplayName] = React.useState("");

  const socket = useSocket();

  const { setMeetingDisplayNames, meetingRooms } = useMeetingState();

  const handleMeetingFormSubmission = (event) => {
    // Prevent default action of reloading
    event.preventDefault();

    if (!displayName) return;

    // Check if display name already exists in meeting
    const meeting = meetingRooms.find(
      (meeting) => meeting.meetingID === props.meetingToJoin.meetingID
    );

    if (
      meeting.allMembers.some(
        (memberDisplayName) => memberDisplayName === displayName
      )
    ) {
      alert("Display name already exists in meeting, try another");
      return;
    }

    // Emit join request event
    socket.emit("meetingJoinRequest", {
      meeting: props.meetingToJoin,
      displayName,
    });

    // Set and store meeting display name
    setMeetingDisplayNames((prevState) => {
      prevState[props.meetingToJoin.title] = displayName;

      localStorage.setItem("meetingDisplayNames", JSON.stringify(prevState));

      return prevState;
    });

    props.setJoiningMeeting(false);
  };

  return (
    <Modal
      modalClassName="px-[4rem]"
      closeFn={() => props.setJoiningMeeting(false)}
    >
      <form className="flex flex-col justify-center gap-[3rem] h-[30rem] w-[50rem] text-[1.4rem]">
        {/* Display Name */}
        <input
          type="text"
          className="bg-[transparent] p-[.5rem] outline-none border-b border-b-[#ffffff80] focus:border-b-white"
          placeholder="Your Display Name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />

        <Button
          onClick={handleMeetingFormSubmission}
          className={`w-[40%] self-end ${!displayName && "opacity-70"}`}
          disabled={!displayName && true}
        >
          Join
        </Button>
      </form>
    </Modal>
  );
}

export default JoinMeetingForm;

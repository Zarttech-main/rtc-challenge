import React from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useMeetingState } from "../../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../../utils/Socket/SocketProvider";

function NewMeetingForm(props) {
  const [meetingTitle, setMeetingTitle] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");

  const socket = useSocket();

  const { setMeetingDisplayNames, meetingRooms } = useMeetingState();

  const handleMeetingFormSubmission = (event) => {
    // Prevent default action of reloading
    event.preventDefault();

    if (!meetingTitle || !displayName) return;

    // If meeting title already exists
    if (meetingRooms.some((meeting) => meeting.title === meetingTitle)) {
      alert("Meeting with same title already exists!");
      return;
    }

    // Emit meeting creation event
    socket.emit("meetingCreation", {
      meetingTitle,
      displayName,
    });

    // Set and store meeting display name
    setMeetingDisplayNames((prevState) => {
      prevState[meetingTitle] = displayName;

      localStorage.setItem("meetingDisplayNames", JSON.stringify(prevState));

      return prevState;
    });

    props.setCreatingMeeting(false);
  };

  return (
    <Modal
      modalClassName="px-[4rem]"
      closeFn={() => props.setCreatingMeeting(false)}
    >
      <form className="flex flex-col justify-center gap-[3rem] h-[30rem] w-[50rem] text-[1.4rem]">
        {/* Meeting title */}
        <input
          type="text"
          className="bg-[transparent] p-[.5rem] outline-none border-b border-b-[#ffffff80] focus:border-b-white"
          placeholder="Meeting Title"
          value={meetingTitle}
          onChange={(event) => setMeetingTitle(event.target.value)}
        />

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
          className={`w-[40%] self-end ${
            (!meetingTitle || !displayName) && "opacity-70"
          }`}
          disabled={(!meetingTitle || !displayName) && true}
        >
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default NewMeetingForm;

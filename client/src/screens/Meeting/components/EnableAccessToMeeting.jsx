import React from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useSocket } from "../../../utils/Socket/SocketProvider";

function EnableAccessToMeeting(props) {
  const socket = useSocket();

  return (
    <Modal
      modalClassName="px-[5rem] py-[10rem]"
      closeFn={() => {
        // Remove requests from queue
        props.setJoinRoomRequests((prevState) => {
          prevState[props.currentMeeting.meetingID] = prevState[
            props.currentMeeting.meetingID
          ].filter((displayName) => displayName !== props.displayName);

          return { ...prevState };
        });
      }}
    >
      <p className="text-[2rem] pb-[4rem]">
        {props.displayName} would like to join your meeting.
      </p>

      <Button
        onClick={() => {
          socket.emit("accessToMeetingGranted", {
            meeting: props.currentMeeting,
            displayName: props.displayName,
          });

          // Remove requests from queue
          props.setJoinRoomRequests((prevState) => {
            prevState[props.currentMeeting.meetingID] = prevState[
              props.currentMeeting.meetingID
            ].filter((displayName) => displayName !== props.displayName);
            return { ...prevState };
          });
        }}
        className="w-full"
      >
        Grant Access
      </Button>
    </Modal>
  );
}

export default EnableAccessToMeeting;

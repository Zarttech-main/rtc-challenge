import React from "react";
import { useMeetingState } from "../../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../../utils/Socket/SocketProvider";

function LeaveMeeting() {
  const socket = useSocket();
  const { setCurrentMeeting } = useMeetingState();

  return (
    <div
      onClick={() => {
        // Emit leaving meeting event to server
        socket.emit("leavingMeeting");
        setCurrentMeeting(null);
      }}
      className="cursor-pointer hover:bg-[#ffffff10] duration-200 p-[1rem] rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="w-[3rem] h-[3rem] rotate-[135deg]"
      >
        <path
          stroke="red"
          // strokeOpacity={0.5}
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          stroke-width="2"
          d="M9.502 4.257A2 2 0 0 0 7.646 3H4.895A1.895 1.895 0 0 0 3 4.895C3 13.789 10.21 21 19.105 21A1.895 1.895 0 0 0 21 19.105v-2.751a2 2 0 0 0-1.257-1.857l-2.636-1.054a2 2 0 0 0-2.023.32l-.68.568a2.001 2.001 0 0 1-2.696-.122L9.792 12.29a2 2 0 0 1-.123-2.694l.567-.68a2 2 0 0 0 .322-2.024L9.502 4.257Z"
        />
      </svg>
    </div>
  );
}

export default LeaveMeeting;

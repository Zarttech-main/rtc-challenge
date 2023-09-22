import React from "react";
import Button from "../../../components/Button";
import { useMeetingState } from "../../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../../utils/Socket/SocketProvider";

function RoomCard(props) {
  const socket = useSocket();

  const { setCurrentMeeting, meetingDisplayNames, setMeetingNewMember } =
    useMeetingState();

  const roomCreatedByUser = React.useMemo(() => {
    // Compare user room display name to the room creator ID
    console.log(meetingDisplayNames);
    return meetingDisplayNames[props.room.title] === props.room.creatorID;

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full rounded-[1.5rem] flex flex-col gap-[3rem] items-center justify-center bg-primary-card-background">
      <h2 className="font-semibold text-[2rem]">{props.room.title}</h2>

      {/* Current members count */}
      <div className="flex items-center gap-[2rem] opacity-50">
        <div className="flex items-center gap-[1rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
            className="w-[2.5rem] h-[2.5rem]"
          >
            <path
              fill="currentColor"
              d="m462.541 316.3l-64.344-42.1l24.774-45.418A79.124 79.124 0 0 0 432.093 192v-72a103.941 103.941 0 0 0-174.609-76.477L279.232 67a71.989 71.989 0 0 1 120.861 53v72a46.809 46.809 0 0 1-5.215 21.452L355.962 284.8l89.058 58.274a42.16 42.16 0 0 1 19.073 35.421V432h-72v32h104v-85.506a74.061 74.061 0 0 0-33.552-62.194Z"
            />
            <path
              fill="currentColor"
              d="m318.541 348.3l-64.343-42.1l24.773-45.418A79.124 79.124 0 0 0 288.093 224v-72A104.212 104.212 0 0 0 184.04 47.866C126.723 47.866 80.093 94.581 80.093 152v72a78 78 0 0 0 9.015 36.775l24.908 45.664L50.047 348.3A74.022 74.022 0 0 0 16.5 410.4L16 496h336.093v-85.506a74.061 74.061 0 0 0-33.552-62.194Zm1.552 115.7H48.186l.31-53.506a42.158 42.158 0 0 1 19.073-35.421l88.682-58.029l-39.051-71.592A46.838 46.838 0 0 1 112.093 224v-72a72 72 0 1 1 144 0v72a46.809 46.809 0 0 1-5.215 21.452L211.962 316.8l89.058 58.274a42.16 42.16 0 0 1 19.073 35.421Z"
            />
          </svg>
          <span className="">{props.room.allMembers.length}</span>
        </div>
      </div>

      {/* Request button when user is not the creator of the room*/}
      {!roomCreatedByUser && (
        <Button
          className="mt-[2rem]"
          onClick={() => {
            props.setMeetingToJoin(props.room);
            props.setJoiningMeeting(true);
          }}
        >
          Request To Join
        </Button>
      )}

      {/* Join button when user is the creator of the room */}
      {roomCreatedByUser && (
        <Button
          className="mt-[2rem]"
          onClick={() => {
            setMeetingNewMember(true);
            setCurrentMeeting(props.room);
            socket.emit("creatorJoinsMeeting", {
              meeting: props.room,
              displayName: meetingDisplayNames[props.room.title],
            });
          }}
        >
          Join
        </Button>
      )}
    </div>
  );
}

export default RoomCard;

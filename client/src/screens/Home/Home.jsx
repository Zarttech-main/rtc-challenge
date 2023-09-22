import React from "react";
import Button from "../../components/Button";
import { useMeetingState } from "../../utils/Meeting/MeetingProvider";
import JoinMeetingForm from "./components/JoinMeetingForm";
import NewMeetingForm from "./components/NewMeetingForm";
import RoomCard from "./components/RoomCard";
import useInit from "./hooks/useInit";

function Home() {
  const { currentMeeting } = useMeetingState();

  // Initialize home component
  const {
    meetingRooms,
    creatingMeeting,
    setCreatingMeeting,
    joiningMeeting,
    setJoiningMeeting,
    meetingToJoin,
    setMeetingToJoin,
  } = useInit();

  return (
    !currentMeeting && (
      <main className="w-full h-[100%] flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-[3rem] mb-[2rem]">
          {/* Heading of page */}
          <h1 className="text-[2.5rem] font-semibold ">
            All Live Meetings{" "}
            <span className="ml-[2rem]">{meetingRooms.length}</span>
          </h1>

          {/* Call to action to create a meeting */}
          <Button className="" onClick={() => setCreatingMeeting(true)}>
            Create Meeting
          </Button>
        </header>

        {/* If there are no existing live rooms */}
        {!Boolean(meetingRooms.length) && (
          <div className="flex-grow flex flex-col gap-[2rem] items-center justify-center">
            <p className="">
              There are no live meetings currently, create one now.
            </p>
            <Button className="" onClick={() => setCreatingMeeting(true)}>
              Create Meeting
            </Button>
          </div>
        )}

        {/* If there are no existing live rooms, show All live rooms grid */}
        {Boolean(meetingRooms.length) && (
          <div className="grid grid-cols-2 auto-rows-[33rem] gap-[2.5rem] content-center">
            {meetingRooms.map((room) => (
              <RoomCard
                room={room}
                setMeetingToJoin={setMeetingToJoin}
                setJoiningMeeting={setJoiningMeeting}
              />
            ))}
          </div>
        )}

        {/* Modal popup to create a new room */}
        {creatingMeeting && (
          <NewMeetingForm setCreatingMeeting={setCreatingMeeting} />
        )}

        {/* Modal popup to join a room */}
        {joiningMeeting && (
          <JoinMeetingForm
            meetingToJoin={meetingToJoin}
            setJoiningMeeting={setJoiningMeeting}
          />
        )}
      </main>
    )
  );
}

export default Home;

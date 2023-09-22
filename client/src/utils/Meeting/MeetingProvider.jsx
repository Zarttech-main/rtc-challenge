import React from "react";

// Create meeting context
const MeetingContext = React.createContext();

export function useMeetingState() {
  // Expose meeting to child components
  return React.useContext(MeetingContext);
}

function MeetingProvider(props) {
  //   All current meeting rooms in Server
  const [meetingRooms, setMeetingRooms] = React.useState([]);

  const [currentMeeting, setCurrentMeeting] = React.useState();

  const [meetingNewMember, setMeetingNewMember] = React.useState();

  //   An object to story every meeting you join or created and your display name in them
  const [meetingDisplayNames, setMeetingDisplayNames] = React.useState(
    JSON.parse(localStorage.getItem("meetingDisplayNames")) || {}
  );

  return (
    <MeetingContext.Provider
      value={{
        meetingRooms,
        setMeetingRooms,
        currentMeeting,
        setCurrentMeeting,
        meetingDisplayNames,
        setMeetingDisplayNames,
        meetingNewMember,
        setMeetingNewMember,
      }}
    >
      {props.children}
    </MeetingContext.Provider>
  );
}

export default MeetingProvider;

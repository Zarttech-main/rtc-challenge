import React from "react";
import Home from "./screens/Home/Home";
import Meeting from "./screens/Meeting/Meeting";
import MeetingProvider from "./utils/Meeting/MeetingProvider";
import SocketProvider from "./utils/Socket/SocketProvider";

function App() {
  return (
    <SocketProvider>
      <MeetingProvider>
        {/* Meeting component, only to render when there's a current meeting */}
        <Meeting />

        {/* Home component, only to render when user is not in a current meeting */}
        <Home />
      </MeetingProvider>
    </SocketProvider>
  );
}

export default App;

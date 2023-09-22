import React from "react";
import io from "socket.io-client";

// Create socket context
const SocketContext = React.createContext();

export function useSocket() {
  // Expose socket to child components
  return React.useContext(SocketContext);
}

function SocketProvider(props) {
  // Create socket connnection
  const socket = io("http://localhost:4000");

  React.useEffect(() => {
    return () => {
      // Socket disconnects as a cleanup function
      socket.disconnect();
    };

    // eslint-disable-next-line
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;

import React from "react";
import Peer from "simple-peer";
import { useMeetingState } from "../../../utils/Meeting/MeetingProvider";
import { useSocket } from "../../../utils/Socket/SocketProvider";

const usePeer = () => {
  const socket = useSocket();

  // Get meetings data
  const {
    currentMeeting,
    setCurrentMeeting,
    meetingDisplayNames,
    meetingNewMember,
    setMeetingNewMember,
  } = useMeetingState();

  // Current user stream
  const [userStream, setUserStream] = React.useState();

  //   Peers reference in socket events
  const peersRef = React.useRef({});

  // Peer state for rendering
  const [peers, setPeers] = React.useState({});

  //   For users joining the meeting
  React.useEffect(() => {
    // If user media stream exists only and user is joining the meeting
    if (userStream && meetingNewMember) {
      // Create a peer to peer connection to all members in the meeting room except yourself
      const otherMembers = currentMeeting.allMembers.filter(
        (memberDisplayName) =>
          memberDisplayName !== meetingDisplayNames[currentMeeting.title]
      );

      const newPeers = {};

      otherMembers.forEach((memberDisplayName) => {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          // User strem
          stream: userStream,
        });

        //   On user peer receiving signal
        peer.on("signal", (signalData) => {
          // Emit signal data to everyone in the meeting
          socket.emit("sendSignalDataToMeeting", {
            meeting: currentMeeting,
            displayName: meetingDisplayNames[currentMeeting.title],
            userToSignal: memberDisplayName,
            signalData,
          });
        });

        peer.on("error", (error) => console.log(error));

        peersRef.current[memberDisplayName] = {
          peer,
          stream: undefined,
          peerName: memberDisplayName,
        };
        newPeers[memberDisplayName] = {
          peer,
          stream: undefined,
          peerName: memberDisplayName,
        };

        // Whenever stream comes in, update
        peer.on("stream", (stream) => {
          setPeers((prevState) => {
            prevState[memberDisplayName].stream = stream;
            peersRef.current[memberDisplayName].stream = stream;

            return { ...prevState };
          });
        });
      });

      setPeers(newPeers);
    }

    // eslint-disable-next-line
  }, [userStream]);

  //   For users already in the meeting
  React.useEffect(() => {
    if (userStream) {
      //   On receiving new signal data, this action belongs to the sockets that are already in the meeting
      socket.on("signalReceived", (data) => {
        // Create a new peer for the signal
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: userStream,
        });

        peer.on("signal", (signalData) => {
          socket.emit("returnSignalToIncomingMember", {
            signalData,
            displayName: data.displayName,
            peerName: meetingDisplayNames[currentMeeting.title],
            meeting: currentMeeting,
          });
        });

        // Signal the incoming signal data
        peer.signal(data.signalData);

        peer.on("error", (error) => console.log(error));

        // Whenever stream comes in, update
        peer.on("stream", (stream) => {
          setPeers((prevState) => {
            prevState[data.displayName].stream = stream;
            peersRef.current[data.displayName].stream = stream;

            return { ...prevState };
          });
        });

        // Add new peer to peersRef
        peersRef.current[data.displayName] = {
          peer,
          stream: undefined,
          peerName: data.displayName,
        };

        setPeers((prevState) => {
          prevState[data.displayName] = {
            peer,
            stream: undefined,
            peerName: data.displayName,
          };

          return { ...prevState };
        });
      });
    }

    return () => {
      socket.off("signalReceived");
    };

    // eslint-disable-next-line
  }, [userStream]);

  React.useEffect(() => {
    socket.on("userLeavingMeeting", (data) => {
      setCurrentMeeting(data.newMeetingObj);

      setPeers((prevState) => {
        const peer = prevState[data.displayName]?.peer;

        if (!peer) return;

        peer.destroy();

        delete prevState[data.displayName];
        delete peersRef.current[data.displayName];

        return { ...prevState };
      });
    });

    socket.on("finalPeerHandshake", (data) => {
      const peer = peersRef.current[data.peerName]?.peer;
      peer.signal(data.signalData);

      // Member is no longer a new member since handshake has been successful
      setMeetingNewMember(false);
    });

    // eslint-disable-next-line
  }, []);

  return { setUserStream, peers, userStream };
};

export default usePeer;

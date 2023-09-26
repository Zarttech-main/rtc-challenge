import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from 'uuid';

import socketIOClient, { Socket } from "socket.io-client"
import { SERVER_BASE_URL, SOCKETEVENTS as SE } from "../utils/constants";
import { Participant, Session } from "../utils/types";
import { PeerAction, PeerState, peersReducer } from "../reducers/peerReducer";
import {removePeerAction } from "../reducers/peerActions";

interface RoomContextValue {
    ws: Socket;
    userPeer: Peer | null;
    stream: MediaStream | null;
    peers: PeerState;
    participants: Participant[];
    isMicOn: boolean;
    isCameraOn: boolean;
    isScreenShareOn: boolean;
    setUserPeer: React.Dispatch<React.SetStateAction<Peer | null>>;
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    dispatchPeers: React.Dispatch<PeerAction>;
    setIsScreenShareOn: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMicOn: React.Dispatch<React.SetStateAction<boolean>>;

}
const ws: Socket = socketIOClient(SERVER_BASE_URL)

export const RoomContext = createContext<RoomContextValue>({
    ws: ws,
    userPeer: null,
    stream: null,
    peers: {},
    participants: [],
    isMicOn: true,
    isCameraOn: true,
    isScreenShareOn: false,
    setUserPeer: () => { },
    setStream: () => { },
    setParticipants: () => { },
    dispatchPeers: () => { },
    setIsCameraOn: () => { },
    setIsScreenShareOn: () => { },
    setIsMicOn: () => { },
});



interface RoomProviderProps {
    children: ReactNode
}
const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [userPeer, setUserPeer] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [peers, dispatchPeers] = useReducer(peersReducer, {})
    const [participants, setParticipants] = useState<Participant[]>([])
    const [isScreenShareOn, setIsScreenShareOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const enterRoomSession = (session: Session) => {
        navigate(`/${session.roomId}/join?session=${session.id}`);
    }
    const getParticipants = ({ roomId, participants }: { roomId: string, participants: Participant[] }) => {
        setParticipants(participants);
    }
    const removePeer = ({ participant }: { participant: Participant }) => {
        dispatchPeers(removePeerAction(participant.peerId))
        setParticipants((prevParticipants) => prevParticipants.filter((pt) => pt.peerId !== participant.peerId));
    }



    useEffect(() => {
        const unid = uuidV4();
        const peer = new Peer(unid);
        setUserPeer(peer);
        ws.on(SE.roomSessionStarted, enterRoomSession)
        ws.on(SE.roomSessionJoined, getParticipants)
        ws.on(SE.peerDisconnected, removePeer)

        return () => {
            ws.off(SE.roomSessionStarted)
            ws.off(SE.roomSessionJoined)
            ws.off(SE.peerDisconnected)
            peer.disconnect();
        }
    }, []);


    return <RoomContext.Provider value={{
        ws, userPeer, stream, peers, participants,
        isCameraOn, isMicOn, isScreenShareOn,
        setParticipants, setUserPeer, setStream, dispatchPeers,
        setIsCameraOn, setIsMicOn, setIsScreenShareOn
    }}>
        {children}
    </RoomContext.Provider>
}

export default RoomProvider

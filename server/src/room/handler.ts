import { Socket } from "socket.io";

import { SOCKETEVENTS as SE } from "../utils/constants";
import { createRoomSession } from "../services/SessionService";
import { Comment, Participant } from "src/utils/types";


const activeRooms: Record<string, Participant[]> = {}

interface ParticipantSessionData {
  roomId: string,
  participant: Participant
}
export const roomHandler = (socket: Socket) => {


  const startSession = async ({ roomId }: { roomId: string }) => {
    console.log("startSession")
    const session = await createRoomSession(roomId)
    activeRooms[roomId] = [];
    socket.emit(SE.roomSessionStarted, session)
  }

  const leaveSession = ({ roomId, participant }: ParticipantSessionData) => {
    console.log("leaveSession")

    activeRooms[roomId] = activeRooms[roomId].filter((pt) => pt.peerId !== participant.peerId);
    console.log("Emit, peerDisconnected")
    socket.to(roomId).emit(SE.peerDisconnected, { roomId, participant })
  }

  const joinSession = async ({ roomId, participant }: ParticipantSessionData) => {
    if (activeRooms[roomId]) {

      if (!activeRooms[roomId].find((pt) => pt.peerId === participant.peerId)) {
        activeRooms[roomId].push(participant);
      };
      socket.join(roomId);
      socket.to(roomId).emit(SE.peerJoined, { participant })
      socket.emit(SE.roomSessionJoined, { roomId, participants: activeRooms[roomId] })
      socket.to(roomId).emit(SE.roomSessionJoined, { roomId, participants: activeRooms[roomId] })
      socket.on(SE.disconnect, () => {

        leaveSession({ roomId, participant })
      })

    }
  }

  const checkRoomInSession = ({ roomId }: { roomId: string }) => {
    const roomState = Object.keys(activeRooms).includes(roomId);
    socket.emit(SE.roomSessionState, { roomState })
  }

  const sendMessage = ({ name, message, roomId }: Comment) => {
    socket.to(roomId).emit(SE.messageSent, { name, message });
  }

  socket.on(SE.sendMessage, sendMessage);
  socket.on(SE.isRoomInSession, checkRoomInSession);
  socket.on(SE.startRoomSession, startSession);
  socket.on(SE.joinRoomSession, joinSession);

}

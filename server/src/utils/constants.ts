export const PORT = process.env.PORT || 5000;
export const IS_DEV = process.env.NODE_ENV !== 'PRODUCTION';

export const SOCKETEVENTS: Record<string, string> = {
    connection: 'connection',
    disconnect: 'disconnect',
    startRoomSession: 'start-room-session',
    roomSessionStarted: 'room-session-started',
    joinRoomSession: 'join-room-session',
    roomSessionJoined: 'room-session-joined',
    peerDisconnected: 'peer-disconnected',
    peerJoined: 'peer-joined',
    peerCall: 'peer-call',
    isRoomInSession: 'is-room-in-session',
    roomSessionState: 'room-session-state',
    sendMessage: 'send-message',
    messageSent: 'message-sent',
}

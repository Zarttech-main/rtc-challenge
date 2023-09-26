export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL as string

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

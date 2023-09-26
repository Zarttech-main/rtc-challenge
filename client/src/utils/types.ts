export interface User {
    data: {
        id: string;
        name: string;
        email: string;
    };
    token: string
}

export interface Room {
    id: string;
    name: string;
    userId: string;
}

export interface Session {
    id: string
    roomId: string;
}

export interface Participant {
    peerId: string
    name: string;
    isRoomOwner?: boolean;
}
export interface Comment {
    message: string
    name: string;
}

export interface MediaConstraints {
    audio: boolean;
    video?: boolean;
}

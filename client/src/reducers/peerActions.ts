import { Participant } from "../utils/types";

export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE" as const;

export const addPeerAction = (peerId: string, stream: MediaStream, metadata?: Participant) => ({
    type: ADD_PEER,
    payload: { peerId, stream, metadata }
})

export const removePeerAction = (peerId: string) => ({
    type: REMOVE_PEER,
    payload: { peerId }
})

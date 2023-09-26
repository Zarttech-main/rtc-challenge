import { Participant } from "../utils/types";
import { ADD_PEER, REMOVE_PEER } from "./peerActions";

export type PeerState = Record<string, { stream: MediaStream, metadata?: Participant }>;
export type PeerAction =
    {
        type: typeof ADD_PEER;
        payload: { peerId: string; stream: MediaStream, metadata?: Participant }
    } | {
        type: typeof REMOVE_PEER;
        payload: { peerId: string; }
    };

export const peersReducer = (state: PeerState, action: PeerAction) => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream,
                    metadata: action.payload.metadata
                }
            }
        case REMOVE_PEER:
            const { [action.payload.peerId]: deleted, ...rest } = state
            return rest;

        default:
            return { ...state };
    }
}


export interface MeetingsMetadata {
  [meetingName: string]: {
    description: string,
    number_of_participants: number
  }
}
export interface ServerToClientEvents {
  meeting_already_exists_error: (meetingName: string) => void;
  meeting_doesnt_exist_error: (meetingName: string) => void;
  created: (meetingName: string) => void;
  offer: (meetingName: string, offer: any, clientId: string) => void;
  answer: (meetingName: string, offer: any, clientId: string) => void;
  candidate: (candidate: any) => void;
  available_meetings: (metadata: MeetingsMetadata) => void
}

export interface ClientToServerEvents {
  new_meeting: (meetingName: string, meetingDescription: string) => void;
  join: (meetingName: string, offer: any) => void;
  answer: (meetingName: string, clientId: string, answer: any) => void;
  candidate: (candidate: any) => void;
}

export interface InterServerEvents {
}

export interface SocketData {
}

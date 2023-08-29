
export interface MeetingsMetadata {
  [meetingName: string]: {
    description: string,
    number_of_participants: number
  }
}
export interface ServerToClientEvents {
  name_changed: (name: string) => void;
  names: (names: {[id: string]:  string}) => void;
  meeting_already_exists_error: (meetingName: string) => void;
  meeting_doesnt_exist_error: (meetingName: string) => void;
  name_already_taken_error: (name: string) => void;
  created: (meetingName: string) => void;
  offer: (meetingName: string, offer: any, clientId: string) => void;
  answer: (meetingName: string, offer: any, clientId: string) => void;
  candidate: (meetingName: string, candidate: any, clientId: string) => void;
  available_meetings: (metadata: MeetingsMetadata) => void;
  joined: (meetingName: string, clientId: string) => void
}

export interface ClientToServerEvents {
  name: (name: string) => void;
  new_meeting: (meetingName: string, meetingDescription: string) => void;
  join_meeting: (meetingName: string, offer: any) => void;
  answer: (meetingName: string, clientId: string, answer: any) => void;
  offer: (meetingName: string, clientId: string, offer: any) => void;
  candidate: (meetingName: string, cleintId: string, candidate: any) => void;
}

export interface InterServerEvents {
}

export interface SocketData {
}

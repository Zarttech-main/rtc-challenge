import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Socket, io } from 'socket.io-client';

const SERVER_URL = "ws://localhost:3000";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private meetingsData: MeetingsMetadata = {};
  private meetingsSubscribers: Array<Subscriber<MeetingsMetadata>> = [];
  public readonly meetingsObservable: Observable<MeetingsMetadata>;
  constructor() {
    this.meetingsObservable = new Observable((subscriber) => {
      subscriber.next(this.meetingsData);
      this.meetingsSubscribers.push(subscriber);
    });

    const socket = io(SERVER_URL, {
      transports: ["websocket"]
    });
    socket.on("available_meetings", (meetingsData: MeetingsMetadata) => {
      this.meetingsData = meetingsData;
      this.meetingsSubscribers.forEach(subscriber => subscriber.next(meetingsData));
    });
    this.socket = socket;
  }
  createMeeting(name: string, description: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.socket.emit("new_meeting", name, description);
        this.socket.on("created", (meetingName) => {
          if (meetingName == name) resolve();
        });
        this.socket.on("meeting_already_exists_error", (meetingName) => {
          if (meetingName == name) reject("Meeting already exists");
        });
      } catch (err: any) {
        reject(err.message);
      }
    });
  }

}


export interface MeetingsMetadata {
  [meetingName: string]: {
    description: string,
    number_of_participants: number
  }
}
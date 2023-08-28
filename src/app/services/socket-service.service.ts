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
  private peerConnections: PeerConnections = {};
  private _ownStream: MediaStream | null = null;
  private get ownStream(): Promise<MediaStream> {
    return !this._ownStream ? navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }) : Promise.resolve(this._ownStream);
  };
  pendingJoinCallbacks: Array<Function> = [];
  streams: MediaStreams = {};
  streamsObservables: StreamsObservables = {};
  streamsSubscribers: StreamsSubscribers = {};
  candidates: any = {};


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
    socket.on("meeting_doesnt_exist_error", (meetingName) => {
      if (this.pendingJoinCallbacks.length) this.pendingJoinCallbacks[1]("Meeting doesn't exist");
    });
    socket.on("joined", async (meetingName: string, clientId: string) => {
      if (clientId == socket.id) {
        this.pendingJoinCallbacks[0]();
        this.pendingJoinCallbacks = [];
        this.peerConnections[meetingName] = {};
        this.streams[meetingName] = {};
        this.candidates[meetingName] = [];
        this.streamsObservables[meetingName] = new Observable(subscriber => {
          if (!this.streamsSubscribers[meetingName]) this.streamsSubscribers[meetingName] = [];
          this.streamsSubscribers[meetingName].push(subscriber);
          subscriber.next(this.streams[meetingName]);
        });
        return;
      }
      if (!this.peerConnections[meetingName]) return; // ignore because we are not part of this meeting
      const peerConnection = this.peerConnections[meetingName][clientId] = new RTCPeerConnection({
      });
      peerConnection.onicecandidate = event => socket.emit("candidate", meetingName, clientId, event.candidate);
      peerConnection.ontrack = event => {
        let stream = this.streams[meetingName][clientId];
        if (!stream) stream = this.streams[meetingName][clientId] = new MediaStream();
        event.streams.forEach(incomingStream => incomingStream.getTracks().forEach(track => stream.addTrack(track)))
        this.streamsSubscribers[meetingName].forEach(subscriber => subscriber.next(this.streams[meetingName]));
      }
      const ownStream = await this.ownStream;
      ownStream.getTracks().forEach(track => peerConnection.addTrack(track, ownStream!!));
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", meetingName, clientId, offer);
    });
    socket.on("offer", async (meetingName: string, offer: any, clientId: string) => {
      if (!this.peerConnections[meetingName]) return; // ignore because we are not part of this meeting
      const peerConnection = this.peerConnections[meetingName][clientId] = new RTCPeerConnection({
      });
      peerConnection.ontrack = event => {
        let stream = this.streams[meetingName][clientId];
        if (!stream) stream = this.streams[meetingName][clientId] = new MediaStream();
        event.streams.forEach(incomingStream => incomingStream.getTracks().forEach(track => stream.addTrack(track)))
        this.streamsSubscribers[meetingName].forEach(subscriber => subscriber.next(this.streams[meetingName]));
      }

      peerConnection.onicecandidate = event => socket.emit("candidate", meetingName, clientId, event.candidate);
      const ownStream = await this.ownStream;
      ownStream?.getTracks().forEach(track => peerConnection.addTrack(track, ownStream!!));
      await peerConnection.setRemoteDescription(offer);
      this.candidates[meetingName][clientId]?.forEach((candidate: any) => {
        peerConnection.addIceCandidate(candidate);
      });
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", meetingName, clientId, answer);
    });
    socket.on("answer", (meetingName: string, answer: any, clientId: string) => {
      if (!(this.peerConnections[meetingName] && this.peerConnections[meetingName][clientId])) return; // ignore because we are not part of this meeting
      this.peerConnections[meetingName][clientId].setRemoteDescription(answer);
      this.peerConnections[meetingName][clientId].onicecandidate = event => socket.emit("candidate", meetingName, clientId, event.candidate);
    });
    socket.on("candidate", async (meetingName: string, candidate: any, clientId) => {
      if (!this.peerConnections[meetingName][clientId].currentRemoteDescription) {
        if (!this.candidates[meetingName][clientId]) this.candidates[meetingName][clientId] = []
        this.candidates[meetingName][clientId].push(candidate);
        return
      };
      await this.peerConnections[meetingName][clientId].addIceCandidate(candidate);
    });
    this.socket = socket;
  }
  createMeeting(name: string, description: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.socket.emit("new_meeting", name, description);
        this.pendingJoinCallbacks = [resolve, reject];
      } catch (err: any) {
        reject(err.message);
      }
    });
  }
  joinMeeting(name: string): Promise<void> {
    return new Promise((async (resolve, reject) => {
      try {
        this.socket.emit("join_meeting", name);
        this.pendingJoinCallbacks = [resolve, reject];
      } catch (err: any) {
        reject(err.message);
      }
    }));
  }
  setOwnStream(stream: MediaStream) {
    this._ownStream = stream;
  }

}


export interface MeetingsMetadata {
  [meetingName: string]: {
    description: string,
    number_of_participants: number
  }
}

export interface PeerConnections {
  [meetingName: string]: {
    [peerId: string]: RTCPeerConnection
  }
}
export interface MeetingStreamsInfo {
  [peerId: string]: MediaStream
}
export interface MediaStreams {
  [meetingName: string]: MeetingStreamsInfo
}
export interface StreamsObservables {
  [meetingName: string]: Observable<MeetingStreamsInfo>
}
export interface StreamsSubscribers {
  [meetingName: string]: Array<Subscriber<any>>
}
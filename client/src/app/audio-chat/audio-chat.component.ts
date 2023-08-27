import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router"; 
import { v1 as uuid } from "uuid"; 
import { io, Socket } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
 
interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}

@Component({
  selector: 'app-audio-chat',
  templateUrl: './audio-chat.component.html',
  styleUrls: ['./audio-chat.component.scss']
})

export class AudioChatComponent implements OnInit {

  currentUserId:string = uuid();
  videos: VideoElement[] = [];
  otherUser:Array<string> = []
  peerRef:any = {};
  userStream:any;
  callId:string = ""

  private socket: Socket;
  isConnected = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private toastrService: ToastrService
  ) { 
 
    this.socket = io(environment.apiUrl);   

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    }); 
  }

  ngOnInit() { 
  // get device media profile
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      if (stream) {
          this.addMyVideo(stream);
          this.userStream = stream;
        } 

        this.route.params.subscribe((params:any ) => { 
           this.callId =  `http://localhost:4200/audio/${params.callId}`

          this.socket.emit('join room', params.callId)
        
        });


        this.socket.on('other user', userID => { 
          
          this.callUser(userID); 
          this.otherUser.push(userID);

         });
  
         this.socket.on("user joined", (userID:string) => { 
          this.otherUser.push(userID);
        });

        // WATCH FOR AN INCOMING USER OFFER 
        this.socket.on("offer", this.handleOffer);


        // WAIT FOR USER TO ACCEPT THE OFFER
        this.socket.on("answer", this.handleAnswer);

        //WAIT FOR USER TO SEND ICE CANDIDATE
        this.socket.on("ice-candidate", this.handleNewICECandidateMsg);
    }); 
 
  }
 
 
 callUser(userID:string) {
    this.peerRef = this.createPeer(userID);
    this.userStream.getTracks().forEach((track:any) => this.peerRef.addTrack(track, this.userStream)); 
}
 

// create the webrtc connection
 createPeer(userID:string) {
  const configuration = { iceServers: [{ urls:environment.stunServer }] };
 
  const peer = new RTCPeerConnection(configuration); 


  peer.onicecandidate = this.handleICECandidateEvent;
  peer.ontrack = (e:any)=>this.handleTrackEvent(userID, e);
  peer.onnegotiationneeded = () => this.handleNegotiationNeededEvent(userID);

  // NETWORK RECOVERY, CHECK FOR NETWORK STATUS AND REJOIN IF DISCONECTED
  peer.onconnectionstatechange = () => {
    if (peer.connectionState === 'connected') {
      this.isConnected = true;
      this.toastrService.info('Connected!', 'Alert'); 
    } else if (peer.connectionState === 'disconnected') {
      this.isConnected = false;
      this.toastrService.warning('Connection lost. Reconnecting...');  

      // rejoin the meeting 
      this.reconnect(userID);
    }
  };

  return peer;
}


handleICECandidateEvent = (e:any) => { 
  if (e.candidate) {
      const payload = {
          target: this.otherUser,
          candidate: e.candidate,
      }  
  }
}


 handleTrackEvent(userId:string, e:any) { 
  this.addOtherUserVideo(userId, e.streams[0]) 
};


 handleNegotiationNeededEvent = (userID:string) => {
  this.peerRef.createOffer().then((offer:any) => {
      return this.peerRef.setLocalDescription(offer);
  }).then(() => {
      const payload = {
          target: userID,
          caller: this.socket.id,
          sdp: this.peerRef.localDescription
      }; 
      this.socket.emit("offer", payload);
  }).catch((e:any) => console.log(e));
}


 handleNewICECandidateMsg = (incoming:any) =>{

  if(incoming.candidate !==''){ 
    console.warn("I JUST RECEIVED THE INCOMING ICE CANDIDATE", incoming) 
    const candidate = new RTCIceCandidate(incoming);
 
    this.peerRef.addIceCandidate(candidate)
      .catch((e:any)=> console.log(e));
  }
}

 
handleOffer = (incoming:any) => { 

  console.warn("I JUST RECEIVED AN OFFER WITH SESSION PROFILE", incoming) 
  this.peerRef = this.createPeer(incoming.caller); 
  
  const desc = new RTCSessionDescription(incoming.sdp);
  this.peerRef.setRemoteDescription(desc).then(() => {
      this.userStream.getTracks().forEach((track:any) => this.peerRef.addTrack(track, this.userStream));
  }).then(() => {
      return  this.peerRef.createAnswer();
  }).then((answer:any) => {
      return  this.peerRef.setLocalDescription(answer);
  }).then(() => {
      const payload = {
          target: incoming.caller,
          caller: this.socket.id,
          sdp: this.peerRef.localDescription
      }
      this.socket.emit("answer", payload);
  })
}


  
 handleAnswer = (message:any) => {  
  console.warn("I AM LISTENING TO AN INCOMING ANSWER TO MY OFFER", message)

  const desc = new RTCSessionDescription(message.sdp);
  this.peerRef.setRemoteDescription(desc).catch((e:any) => console.log(e));
}

  
  addMyVideo(stream: MediaStream) { 
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.currentUserId,
    });
  }

  addOtherUserVideo(userId: string, stream: MediaStream) {
    
    const alreadyExisting = this.videos.some(video => video.userId === userId);
    if (alreadyExisting) {
      console.log(this.videos);
      return;
    }
    this.videos.push({
      muted: false,
      srcObject: stream,
      userId,
    });
  }


  
  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }

  endCall() {
    // Close peer connection and release resources
    this.socket.disconnect();
    if (this.userStream) { 
      this.userStream.getTracks().forEach((track:any) => track.stop());
    }
    this.router.navigate(['/']);
  }

  reconnect(userID:string) {
    const maxRetries = 5;
    let retries = 0;

    const reconnectInterval = setInterval(() => {
      if (retries >= maxRetries || this.isConnected) {
        clearInterval(reconnectInterval);
        if (!this.isConnected) {
          this.toastrService.warning('Failed to reconnect. Please try again later.');
        }
        return;
      }

      this.toastrService.warning('Attempting to reconnect... (Attempt ' + (retries + 1) + ')');
      this.createPeer(userID);

      retries++;
    }, 3000); // Retry every 3 seconds
  } 


  ngOnDestroy() {
    this.socket.disconnect();
  }

}

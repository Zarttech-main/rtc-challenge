import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService, MeetingStreamsInfo } from 'src/app/services/socket-service.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent {
  meetingName: string = "";
  streams: MeetingStreamsInfo = {};
  ownStream: MediaStream | null = null;
  constructor(private toastr: ToastrService, private loader: NgxUiLoaderService, private socketService: SocketService, route: ActivatedRoute,private router: Router) {
    const self = this;
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      this.ownStream = stream;
      this.socketService.setOwnStream(stream);
    });
    route.queryParams.subscribe(params => self.meetingName = params["name"])
    socketService.streamsObservables[this.meetingName].subscribe((streams: MeetingStreamsInfo) => {
      this.streams = streams;
    });
  }
  exitMeeting() {
    this.socketService.exitMeeting(this.meetingName);
    this.router.navigateByUrl("/");
  }
}

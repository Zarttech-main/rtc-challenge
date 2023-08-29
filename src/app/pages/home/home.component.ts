import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MeetingsMetadata } from 'server_src/message_formats.mjs';
import { SocketService } from 'src/app/services/socket-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent {
  meetings: MeetingsMetadata = {};
  constructor(private toastr: ToastrService, private loader: NgxUiLoaderService, private socketService: SocketService, private router: Router) {
    socketService.meetingsObservable.subscribe(meetingsMetaData => this.meetings = meetingsMetaData);
  }
  inMeeting(meetingName: string): boolean {
    return this.socketService.inMeeting(meetingName);
  }
  async joinMeeting(meetingName: string) {
    if (!this.socketService.getName()) {
      this.router.navigateByUrl("choose-name");
      return;
    }
    if (this.inMeeting(meetingName)) {
      this.toastr.success("Rejoined meeting : " + meetingName);
      this.router.navigateByUrl("meeting?name=" + meetingName);
      return;
    }
    this.loader.start();
    try {
      await this.socketService.joinMeeting(meetingName);
      this.toastr.success("Joined meeting : " + meetingName);
      this.router.navigateByUrl("meeting?name=" + meetingName);
    } catch (error: any) {
      console.log(error)
      this.toastr.error(error)
    } finally {
      this.loader.stop();
    }
  }
}

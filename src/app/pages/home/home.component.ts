import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  constructor(private socketService: SocketService) {console.log(socketService)
    socketService.meetingsObservable.subscribe(meetingsMetaData => this.meetings = meetingsMetaData);
  }
  joinMeeting(meetingName: string) {
    
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService } from 'src/app/services/socket-service.service';

@Component({
  selector: 'app-new-meeting',
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.css']
})
export class NewMeetingComponent {
  constructor(private toastr: ToastrService, private loader: NgxUiLoaderService, private socketService: SocketService, private router: Router) {}
  name = "";
  description = "";
  async submit() {
    this.loader.start();
    try {
      await this.socketService.createMeeting(this.name, this.description);
      this.toastr.success("Meeting created: " + this.name)
  this.router.navigateByUrl("meeting?name=" + this.name);
    } catch (error: any) {
      console.log(error)
      this.toastr.error(error)
    } finally {
      this.loader.stop();
    }

  }
}

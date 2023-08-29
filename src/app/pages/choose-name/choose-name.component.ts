import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService } from 'src/app/services/socket-service.service';


@Component({
  selector: 'app-choose-name',
  templateUrl: './choose-name.component.html',
  styleUrls: ['./choose-name.component.css']
})
export class ChooseNameComponent {
  private nextPage: string = "";
  constructor(private toastr: ToastrService, private loader: NgxUiLoaderService, private socketService: SocketService, private router: Router, route: ActivatedRoute) {
    route.queryParams.subscribe(params => this.nextPage = params["next"])
  }
  name = "";
  async submit() {
    this.loader.start();
    try {
      await this.socketService.setName(this.name);
      this.toastr.success("Username changed to " + this.name)
  this.router.navigateByUrl(this.nextPage);
    } catch (error: any) {
      console.log(error)
      this.toastr.error(error)
    } finally {
      this.loader.stop();
    }

  }
}
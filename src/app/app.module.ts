import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NewMeetingComponent } from './pages/new-meeting/new-meeting.component';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { GetPeerNamePipe } from './pipes/get-peer-name.pipe';
import { ChooseNameComponent } from './pages/choose-name/choose-name.component';
import { SocketService } from './services/socket-service.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewMeetingComponent,
    MeetingComponent,
    GetPeerNamePipe,
    ChooseNameComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

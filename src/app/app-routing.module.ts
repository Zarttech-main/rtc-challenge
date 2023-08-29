import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewMeetingComponent } from './pages/new-meeting/new-meeting.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { ChooseNameComponent } from './pages/choose-name/choose-name.component';

const routes: Routes = [{
  path: "",  title: "Welcome", component: HomeComponent
},{
  path: "new-meeting",  title: "New Meeting", component: NewMeetingComponent
},{
  path: "meeting",  title: "Meeting", component: MeetingComponent
},{
  path: "choose-name",  title: "Choose Name", component: ChooseNameComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

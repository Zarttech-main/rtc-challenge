import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewMeetingComponent } from './pages/new-meeting/new-meeting.component';

const routes: Routes = [{
  path: "",  title: "Welcome", component: HomeComponent
},{
  path: "new-meeting",  title: "New Meeting", component: NewMeetingComponent
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ChatComponent} from "./chat/chat.component";
import { AudioChatComponent } from './audio-chat/audio-chat.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: ':callId',
    component: ChatComponent,
  },
  {
    path: 'audio/:callId',
    component: AudioChatComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

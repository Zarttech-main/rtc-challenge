import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { AudioChatComponent } from './audio-chat/audio-chat.component';

 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr'; 
 
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AudioChatComponent, 
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule, 
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 15000, // 15 seconds
      closeButton: true,
      progressBar: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

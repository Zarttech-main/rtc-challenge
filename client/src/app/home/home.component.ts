import { Component, OnInit } from '@angular/core'; 
import { v1 as uuid } from "uuid";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  createVideoCall() { 
    this.router.navigate([`/${uuid()}`]);
  }

  createAudioCall() { 
    this.router.navigate([`audio/${uuid()}`]);
  }
  
}

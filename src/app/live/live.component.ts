import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

import { HueService } from '../components/services/hue.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {

  constructor(private hueService: HueService,
    private router: Router,
    public snackBar: MatSnackBar) { }
  
  scriptRunning = true;

  ngOnInit() {
    this.hueService.startWatchingForScriptErrors().then(()=>{},
  ()=>{
    this.stopLightSync();
    this.showErrorSnackBar();
  })
  }

  showErrorSnackBar(){
    this.snackBar.open("An error has occurred while running the script.", null, {
      duration: 2000,
    });
  }
  
  stopLightSync(){
    this.scriptRunning = false;
    this.hueService.hueStop();
    this.router.navigate(['/setup']);
  }

}

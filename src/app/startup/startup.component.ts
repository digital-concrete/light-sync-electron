import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from "@angular/router";

import { HueService } from '../components/services/hue.service';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {

  constructor(private hueService: HueService, private router: Router, public _zone: NgZone) {
    var hasConfig = this.hueService.checkHueConfigExists();

    if(hasConfig){
      console.log("has config");
      this.hueService.getLights().then((res)=>{
          this._zone.run(()=>{
            this.router.navigate(['/setup']);
          });
      }, ()=>{
        console.log("existing config not working");
        this._zone.run(()=>{
          this.router.navigate(['/connect']);
        });
      })
    } else {
      console.log("no config");
      this.router.navigate(['/connect']);
    }
   }

  ngOnInit() {
  }

}

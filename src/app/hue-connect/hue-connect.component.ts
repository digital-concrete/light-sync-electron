import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Observable, interval, timer } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import {Router} from "@angular/router";

import { HueService } from '../components/services/hue.service';


@Component({
  selector: 'app-hue-connect',
  templateUrl: './hue-connect.component.html',
  styleUrls: ['./hue-connect.component.scss']
})
export class HueConnectComponent implements AfterViewInit {

  bridgeIp: String
  finishedBridgeSearch;
  buttonNotPressed = false;
  
  constructor(private hueService: HueService, 
    private router: Router,
    private cdref: ChangeDetectorRef,
    public _zone: NgZone
  ) { }
  
  ngAfterViewInit() {
      this.discovery();
  }

  max     = 30;
  current = 0;
  hasRegistered = false;

   /// finish timer
  finishTimer() {
    this.current = this.max;
    this.hasRegistered = true;
  }

  /// reset timer
  reset() {
    this.current = 0;
  }
  
  registerUser(){

    const myInterval = interval(1000);
    this.reset();
    
    myInterval
      .pipe(takeWhile(_ => !this.isFinished ))
      .pipe(tap(i => {this.current += 1; this.cdref.detectChanges();}))
      .subscribe(()=>{
        this.hueService.registerUser(this.bridgeIp).then(()=>{
          this.finishTimer();
          this._zone.run(()=>{
            this.cdref.detectChanges();
            this.router.navigate(['/setup']);
          });
        })
      },
      ()=>{},
      ()=>{
        if(!this.hasRegistered){
          this.buttonNotPressed = true;
          console.log("Must press bridge button within 30 secs");
          this.cdref.detectChanges();
        }
      }
    );
  }

  getLights(){
      this.hueService.getLights().then((res)=>{
        // console.log("get light result");
        // console.log(res);
    })
  }


  /// Getters to prevent NaN errors

  get maxVal() {
    return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max;
  }

  get currentVal() {
    return isNaN(this.current) || this.current < 0 ? 0 : this.current;
  }

  get displayVal() {
    let val =  isNaN(this.current) || this.current < 0 ? 0 : this.current;
    let result = ((this.max - val)/this.max)*100;
    return result
  }

  get isFinished() {
    return this.currentVal >= this.maxVal;
  }
  

  
  discovery(){
    this.hueService.findBridges().then((res)=>{

        this.bridgeIp = res[0].ipaddress;
        console.log("found bridge");
        console.log(res);
        this.finishedBridgeSearch = true;
        this.cdref.detectChanges();

        this.registerUser();

    });
  }
  
  retryDiscovery(){
    this.discovery();
  }
  
  retryRegister(){
    this.buttonNotPressed = false;
    this.cdref.detectChanges();
    this.registerUser();
  }
}

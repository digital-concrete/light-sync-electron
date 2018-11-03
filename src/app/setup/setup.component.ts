import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material';
import {FormControl} from '@angular/forms';


import { HueService } from '../components/services/hue.service';
import { LocalStorageService } from '../components/services/localstorage.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  
  @Input()  isRunning: Boolean;
  devMode = false
  availableLights
  defaultSetupModel = {
      minBrightness: 1, 
      maxBrightness: 150,
      transitionType: "0",
      dimLightsInsteadOfTurnOff: "True",
      transitionTime: 1,
      frameTransitionSensitivity: 0.1,
      frameMatchSensitivity: 0.008,
      colorSkipSensitivity: 10,
      channelsMinThreshold: 60,
      channelsMaxThreshold: 190,
      minNzCount: 0.2,
      maxNzCount: 20,
      colorSpreadThreshold: 0.4,
      kMeansClusters: 6,
      shrinkFrameSize: 100,
      maxRequestsPerSecond: 10,
      screenDist: "full",
      // FLICKER stuff
      flickerCorrection: true,
      flickerResetCounter: 30,
      flickeRresetSensitivity: 0.3,
      colorFlickerSensitivity: 0.2,
      colorFlickerInput: 4,
      onOffFlickerInput: 8,
      colorFlickerCount: 2,
      onOffFlickerCount: 2,
      onOffFlickerMinNzCorrection: 0.1,
      onOffFlickerChannelsMinCorrection: 0.2,
      // META values
      sensitivity: 50
    }

  setupModel = Object.assign({},this.defaultSetupModel)
  showLoading = true;
  selectedLightsStereoLeft = new FormControl();
  selectedLightsStereoRight = new FormControl();
  selectedLightsFull = [];
  advancedSettingsExpanded = false;
  flickerCorrectionSlideToggle = new FormControl();

  constructor(private hueService: HueService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    public _zone: NgZone,
    public snackBar: MatSnackBar,
    private localStorage: LocalStorageService)
    { }

  ngOnInit() {
    // Do config check to prevent edge case hacks
    var hasConfig = this.hueService.checkHueConfigExists();
    if(hasConfig){
      this.hueService.getLights().then((res)=>{
          // console.log("get light result");
          // console.log(res);
          this._zone.run(()=>{
            this.availableLights = res.lights;
            this.showLoading = false;
            this.cdref.detectChanges();
        });

      }, ()=>{
        console.log("existing config not working");
        this._zone.run(()=>{
          this.router.navigate(['/connect']);
        });
      });

      let userSettings = this.localStorage.getObject('userSettings'); 
      console.log(userSettings)
      if(userSettings){
        this.setupModel.minBrightness = userSettings.dimBrightness;
        this.setupModel.maxBrightness = userSettings.maxBrightness;
        this.setupModel.transitionType = userSettings.transitionType;
        this.setupModel.dimLightsInsteadOfTurnOff = userSettings.dimLightsInsteadOfTurnOff;
        this.setupModel.screenDist = userSettings.screenDist;

        // LIGHTS
        this.selectedLightsStereoLeft.setValue(userSettings.selectedLightsStereoLeft);
        this.selectedLightsStereoRight.setValue(userSettings.selectedLightsStereoRight);
        this.selectedLightsFull = userSettings.selectedLightsFull;

        // ADVANCED
        this.setupModel.transitionTime = userSettings.transitionTime,
        this.setupModel.frameTransitionSensitivity = userSettings.frameTransitionSensitivity,
        this.setupModel.colorSkipSensitivity = userSettings.colorSkipSensitivity,
        this.setupModel.frameMatchSensitivity = userSettings.frameMatchSensitivity,
        this.setupModel.channelsMinThreshold = userSettings.channelsMinThreshold,
        this.setupModel.channelsMaxThreshold = userSettings.channelsMaxThreshold,
        this.setupModel.minNzCount= userSettings.minNzCount,
        this.setupModel.maxNzCount= userSettings.maxNzCount,
        this.setupModel.colorSpreadThreshold= userSettings.colorSpreadThreshold,
        this.setupModel.kMeansClusters= userSettings.kMeansClusters,
        this.setupModel.shrinkFrameSize = userSettings.shrinkFrameSize,
        this.setupModel.maxRequestsPerSecond = userSettings.maxRequestsPerSecond,

        // FLICKER
        this.setupModel.flickerCorrection = userSettings.flickerCorrection,
        this.setupModel.flickerResetCounter = userSettings.flickerResetCounter,
        this.setupModel.flickeRresetSensitivity = userSettings.flickeRresetSensitivity,
        this.setupModel.colorFlickerSensitivity = userSettings.colorFlickerSensitivity,
        this.setupModel.colorFlickerInput = userSettings.colorFlickerInput,
        this.setupModel.onOffFlickerInput = userSettings.onOffFlickerInput,
        this.setupModel.colorFlickerCount = userSettings.colorFlickerCount,
        this.setupModel.onOffFlickerCount = userSettings.onOffFlickerCount,
        this.setupModel.onOffFlickerMinNzCorrection = userSettings.onOffFlickerMinNzCorrection,
        this.setupModel.onOffFlickerChannelsMinCorrection = userSettings.onOffFlickerChannelsMinCorrection,
        
        // META
        this.setupModel.sensitivity = userSettings.sensitivity

        this.flickerCorrectionSlideToggle.setValue(this.setupModel.flickerCorrection)
        this.cdref.detectChanges();
      }
    } else {
      console.log("no config found");
        this._zone.run(()=>{
          this.router.navigate(['/connect']);
        });
    }
  }
  
  startLightSync(setupForm, advancedSetupForm){

    console.log(this.selectedLightsFull);
    // console.log(setupForm)
    // console.log(this.setupModel)
    // console.log("selected left:")
    // console.log(this.selectedLightsStereoLeft.value)
    // console.log("selected right:")
    // console.log(this.selectedLightsStereoRight.value)
    if((this.setupModel.screenDist == "full" && this.selectedLightsFull && this.selectedLightsFull.length > 0)
      || ((this.setupModel.screenDist == "stereo" || this.setupModel.screenDist == "sides")
      && this.selectedLightsStereoLeft.value && this.selectedLightsStereoLeft.value.length > 0
      && this.selectedLightsStereoRight.value && this.selectedLightsStereoRight.value.length > 0)){
      if(setupForm.valid && advancedSetupForm.valid){
        if(this.setupModel.minBrightness > this.setupModel.maxBrightness){
          this.snackBar.open("Min brightness must be less than max brightness", null, {
            duration: 2000,
          });
          return
        }

        if(this.setupModel.channelsMinThreshold > this.setupModel.channelsMaxThreshold){
          this.snackBar.open("Channels Min Threshold must be less than Channels Max Threshold", null, {
            duration: 2000,
          });
          return
        }

        if(this.setupModel.minNzCount > this.setupModel.maxNzCount){
          this.snackBar.open("Min Non Zero Count must be less than max Non Zero Count", null, {
            duration: 2000,
          });
          return
        }

        if(this.setupModel.dimLightsInsteadOfTurnOff == undefined
          || !this.setupModel.transitionType == undefined
          || !this.setupModel.screenDist == undefined){
          this.snackBar.open("One option must be selected for Dim/TurnOff and Screen distribution", null, {
            duration: 2000,
          });
          return
        }

        var params
        
        var hasConfig = this.hueService.checkHueConfigExists();
        if(hasConfig){

          switch(this.setupModel.screenDist){
            case "full":{
              console.log("in full mode");
              params = this.startHueScript(this.selectedLightsFull, "full");
              break;
            }
            case "stereo":{
              console.log("in stereo mode");
              this.startHueScript(this.selectedLightsStereoLeft.value, "left");
              params = this.startHueScript(this.selectedLightsStereoRight.value, "right");
              break;
            }
            case "sides":{
              console.log("in stereo mode");
              this.startHueScript(this.selectedLightsStereoLeft.value, "side-left");
              params = this.startHueScript(this.selectedLightsStereoRight.value, "side-right");
              break;
            }
          }

          
          let saveParams = Object.assign(params);
          saveParams.selectedLightsStereoLeft= this.selectedLightsStereoLeft.value;
          saveParams.selectedLightsStereoRight= this.selectedLightsStereoRight.value;
          saveParams.selectedLightsFull= this.selectedLightsFull;
          this.localStorage.setObject('userSettings', saveParams);
          this.router.navigate(['/live']);
        } else {
          console.log("no config found");
          this._zone.run(()=>{
            this.router.navigate(['/connect']);
          });
        }
      }
    } else {
      this.snackBar.open("Please select at least one light for each dropdown", null, {
        duration: 2000,
      });
    }
  }

  onLightOptionSelectionChange(event, matchArray){
    if(event.value && event.value.length >0){
      event.value.forEach(value => {
        console.log(value);
        let tempArray = []
        Object.assign(tempArray, matchArray.value);
        tempArray.forEach((light, index) =>{
          if(light == value){
            tempArray.splice(index,1)
          }
        })
        matchArray.setValue(tempArray);
      })
    }
  }

  onAdvancedSettingsOpened(){
    this.advancedSettingsExpanded = true;
  }

  onAdvancedSettingsClosed(){
    this.advancedSettingsExpanded = false;
  }
  
  onflickerCorrectionSlideToggleChange(ev) {
    this.setupModel.flickerCorrection = this.flickerCorrectionSlideToggle.value;
  }

  mapToInterval(A,B,a,b,val){
    return (val - A)*(b-a)/(B-A) + a
  }

  onSensitivityChange(ev){
    let sensitivityValue = 100 - this.setupModel.sensitivity;

    this.setupModel.frameMatchSensitivity = this.mapToInterval(0,100, 0.0005, 0.01, sensitivityValue)
    this.setupModel.minNzCount = this.mapToInterval(0,100, 0.003, 0.4, sensitivityValue)
    this.setupModel.channelsMinThreshold = Math.round(this.mapToInterval(0,100, 1, Math.round(this.setupModel.channelsMaxThreshold/2), sensitivityValue))
  }

  startHueScript(selectedLightsList, screenPart){
    console.log(this.setupModel)
    console.log(selectedLightsList)
    let params = {
      dimBrightness: this.setupModel.minBrightness,
      maxBrightness: this.setupModel.maxBrightness,
      transitionType: this.setupModel.transitionType,
      dimLightsInsteadOfTurnOff: this.setupModel.dimLightsInsteadOfTurnOff,
      transitionTime: this.setupModel.transitionTime,
      frameTransitionSensitivity: this.setupModel.frameTransitionSensitivity,
      colorSkipSensitivity: this.setupModel.colorSkipSensitivity,
      frameMatchSensitivity: this.setupModel.frameMatchSensitivity,
      channelsMinThreshold: this.setupModel.channelsMinThreshold,
      channelsMaxThreshold: this.setupModel.channelsMaxThreshold,
      minNzCount: this.setupModel.minNzCount,
      maxNzCount: this.setupModel.maxNzCount,
      colorSpreadThreshold: this.setupModel.colorSpreadThreshold,
      kMeansClusters: this.setupModel.kMeansClusters,
      shrinkFrameSize: ((this.setupModel.screenDist == "stereo" || this.setupModel.screenDist == "sides") ? this.setupModel.shrinkFrameSize/2: this.setupModel.shrinkFrameSize),
      maxRequestsPerSecond: ((this.setupModel.screenDist == "stereo" || this.setupModel.screenDist == "sides") ? this.setupModel.maxRequestsPerSecond/2: this.setupModel.maxRequestsPerSecond),
      screenDist: this.setupModel.screenDist,
      screenPart: screenPart,
      lights: selectedLightsList,
      // FLICKER stuff
      flickerCorrection: this.setupModel.flickerCorrection,
      flickerResetCounter: this.setupModel.flickerResetCounter,
      flickeRresetSensitivity: this.setupModel.flickeRresetSensitivity,
      colorFlickerSensitivity: this.setupModel.colorFlickerSensitivity,
      colorFlickerInput: this.setupModel.colorFlickerInput,
      onOffFlickerInput: this.setupModel.onOffFlickerInput,
      colorFlickerCount: this.setupModel.colorFlickerCount,
      onOffFlickerCount: this.setupModel.onOffFlickerCount,
      onOffFlickerMinNzCorrection: this.setupModel.onOffFlickerMinNzCorrection,
      onOffFlickerChannelsMinCorrection: this.setupModel.onOffFlickerChannelsMinCorrection,
      // META used for save
      sensitivity: this.setupModel.sensitivity
    }
    this.hueService.hueStart(params)
    params.shrinkFrameSize = this.setupModel.shrinkFrameSize
    params.maxRequestsPerSecond = this.setupModel.maxRequestsPerSecond
    return params
  }

  resetDefaults(){
    this.setupModel = Object.assign({},this.defaultSetupModel)
    this.selectedLightsFull = []
    this.selectedLightsStereoLeft.setValue([])
    this.selectedLightsStereoRight.setValue([])
    this.flickerCorrectionSlideToggle.setValue(this.setupModel.flickerCorrection)
  }
}

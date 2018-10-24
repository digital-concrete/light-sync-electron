import { Injectable } from '@angular/core';
     
@Injectable()
export class HueService {

    private _bridgeIp

    checkHueConfigExists(){
        var hasConfig = (<any>window).checkHueConfig();
        console.log("has config");
        console.log(hasConfig);
        return hasConfig;
    }
    
    findBridges(){
        var promise = (<any>window).findBridges()
        promise.then(function(res){
            console.log(res);
            this._bridgeIp = res[0].ipaddress; 
        })
        return promise;
    }

    registerUser(bridgeIp){
        if(bridgeIp){
            return (<any>window).bridgeRegister(bridgeIp);
        } else return new Promise(function(resolve, reject) {
            reject("No bridge Ip found. Please do bridge discovery first");
        });
    }

    getLights(){
        return (<any>window).getLights();
    }

    getGroups(){
        return (<any>window).getGroups();
    }

    hueStart(params){

        let scriptParams = [];
        scriptParams.push('--lights');
        scriptParams.push(params.lights.toString());
        scriptParams.push('--dimbrightness');
        scriptParams.push(params.dimBrightness.toString());
        scriptParams.push('--maxbrightness');
        scriptParams.push(params.maxBrightness.toString());
        scriptParams.push('--transitiontype');
        scriptParams.push(params.transitionType);
        scriptParams.push('--dimlightsinsteadofturnoff');
        scriptParams.push(params.dimLightsInsteadOfTurnOff.toString().charAt(0).toUpperCase() + params.dimLightsInsteadOfTurnOff.toString().slice(1));
        scriptParams.push('--screenpart');
        scriptParams.push(params.screenPart.toString());

        // ADVANCED PARAMS
        scriptParams.push('--transitiontime');
        scriptParams.push(params.transitionTime.toString());
        
        scriptParams.push('--frametransitionsensitivity');
        scriptParams.push(params.frameTransitionSensitivity.toString());

        scriptParams.push('--framematchsensitivity');
        scriptParams.push(params.frameMatchSensitivity.toString());

        scriptParams.push('--colorskipsensitivity');
        scriptParams.push(params.colorSkipSensitivity.toString());

        scriptParams.push('--channelsminthreshold');
        scriptParams.push(params.channelsMinThreshold.toString());

        scriptParams.push('--channelsmaxthreshold');
        scriptParams.push(params.channelsMaxThreshold.toString());

        scriptParams.push('--minnzcount');
        scriptParams.push(params.minNzCount);

        scriptParams.push('--maxnzcount');
        scriptParams.push(params.maxNzCount);

        scriptParams.push('--colorspreadthreshold');
        scriptParams.push(params.colorSpreadThreshold.toString());

        scriptParams.push('--kmeansclusters');
        scriptParams.push(params.kMeansClusters.toString());

        scriptParams.push('--shrinkframesize');
        scriptParams.push(params.shrinkFrameSize);

        scriptParams.push('--maxrequestspersecond');
        scriptParams.push(params.maxRequestsPerSecond);

        // FLICKER STUFF
        scriptParams.push('--flickercorrection');
        scriptParams.push(params.flickerCorrection);

        scriptParams.push('--flickerresetcounter');
        scriptParams.push(params.flickerResetCounter);

        scriptParams.push('--flickerresetsensitivity');
        scriptParams.push(params.flickeRresetSensitivity);

        scriptParams.push('--colorflickersensitivity');
        scriptParams.push(params.colorFlickerSensitivity);

        scriptParams.push('--colorflickerinput');
        scriptParams.push(params.colorFlickerInput);

        scriptParams.push('--onoffflickerinput');
        scriptParams.push(params.onOffFlickerInput);

        scriptParams.push('--colorflickercount');
        scriptParams.push(params.colorFlickerCount);

        scriptParams.push('--onoffflickercount');
        scriptParams.push(params.onOffFlickerCount);

        scriptParams.push('--onoffflickerminnzcorrection');
        scriptParams.push(params.onOffFlickerMinNzCorrection);

        scriptParams.push('--onoffflickerchannelsmincorrection');
        scriptParams.push(params.onOffFlickerChannelsMinCorrection);
        

        console.log(scriptParams);

        (<any>window).hueStart(scriptParams)
      }
    
    hueStop(){
        (<any>window).hueStop()
    }

    startWatchingForScriptErrors(){
        return (<any>window).startWatchingForScriptErrors()
    }
}
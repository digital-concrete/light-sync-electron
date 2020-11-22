var fs = require('fs');
var electron = require('electron');
var child_process = require('child_process');
var hue = require("node-hue-api").v3;
var ipcRenderer = require('electron').ipcRenderer;
var path = require('path');
var os = require('os');


var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

var writeConfigFile = function(bridgeIp, userId, clientkey){

    var content = '{"' + bridgeIp + '":{"username":"'+userId+'", "clientkey":"'+clientkey+'"}}';

    let pathToConfig = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'assets', 'phue_config');

    fs.writeFileSync(pathToConfig, content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
}

var readConfigFile = function(){
    let pathToConfig = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'assets', 'phue_config');

    console.log(pathToConfig);
    var configObj = JSON.parse(fs.readFileSync(pathToConfig, 'utf8'));
    return configObj;
}

window.hueProcs = [];

window.hueStart = function(params){
    
    var productionEnv = process.env; // TODO should clone process.env like utils.extend
    productionEnv.PYTHONUNBUFFERED = 'PYTHONUNBUFFERED';
    
    let pathToLightSync = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'assets', 'light_sync');
    let pathToWorkingDirectory = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'assets');
    
    if(os.platform() === 'win32'){
        pathToLightSync = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'assets', 'light_sync.exe');
    }

    var hueProc = child_process.spawn(pathToLightSync, params, {env: productionEnv, cwd: pathToWorkingDirectory});

    ipcRenderer.send('pid-message', hueProc.pid);

    hueProc.stdout.on('data', function (data) {
        console.log('stdout: <' + data+'> ');
    });

    hueProc.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    hueProc.on('close', function (code) {
        if (code == 0)
            console.log('child process complete.');
        else
            console.log('child process exited with code ' + code);
    });

    hueProc.on('error', function(err) {
        console.log('An error occured: ' + err);
    });

    window.hueProcs.push(hueProc);
}

window.hueStop = function(){
    console.log("kill hue");
    if(window.hueProcs && window.hueProcs.length > 0){
        window.hueProcs.forEach(function(hueProc){
            if(os.platform() === 'win32'){
                console.log("killing win processes");
                console.log(hueProc.pid);
                child_process.spawn("taskkill", ["/pid", hueProc.pid, '/f', '/t']);
            } else if(!hueProc.killed){
                    hueProc.kill();
            }
            
        });
    }
}

window.startWatchingForScriptErrors = function(){
    let errorWatchPromise = new Promise((resolve, reject)=>{
        if(window.hueProcs && window.hueProcs.length > 0){
            window.hueProcs.forEach(function(hueProc){
                if(hueProc && !hueProc.killed){
                    hueProc.on('error', function(err) {
                        console.log('An error occured: ' + err);
                        reject();
                    });
                }
            })
        }
    })
    return errorWatchPromise;
}

window.checkHueConfig = function(){
    // let pathToConfig = path.join(__dirname, 'assets/phue_config');
    let pathToConfig = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), 'assets', 'phue_config');

    console.log(pathToConfig);
    if (fs.existsSync(pathToConfig)) {
        return true;
    }
    return false;
}

window.findBridges = function(){
    // hue.nupnpSearch(function(err, result) {
    //     if (err) throw err;
    //     displayBridges(result);
    // });
    
    return hue.discovery.nupnpSearch();
}

window.bridgeRegister = async function(bridgeIp){
    var host = bridgeIp;
    userDescription = "light sync app";

    var onRegisterSuccess = function(result) {
        console.log("Created user: " + result.username);
        
        writeConfigFile(bridgeIp, result.username, result.clientkey);
    };

    var displayError = function(err) {
        console.log(err);
    };

    
    let unauthenticatedApi = await hue.api.createLocal(host).connect();
    let createdUser;
    var registerPromise = unauthenticatedApi.users.createUser('light-sync', os.platform());

    registerPromise.then(onRegisterSuccess, displayError);
    
    return registerPromise;
}

window.getLights = async function(){
    var displayResult = function(result) {
        // console.log(JSON.stringify(result, null, 2));
    };

    var configObj = readConfigFile();

    var host = Object.keys(configObj)[0],
        username = configObj[host]["username"];
    
    var api = await hue.api.createLocal(host).connect(username);
    
    var lightsPromise = api.lights.getAll();

    lightsPromise.then(displayResult);

    return lightsPromise;
}

window.getGroups = async function(){
    var displayResult = function(result) {
        console.log(JSON.stringify(result, null, 2));
    };

    var configObj = readConfigFile();
    
    var host = Object.keys(configObj)[0],
        username = configObj[host]["username"];
    
    var api = await hue.api.createLocal(host).connect(username);
    
    var groupsPromise = api.groups.getALl();

    groupsPromise.then(displayResult);

    return groupsPromise;
}
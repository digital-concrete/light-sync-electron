const { app, BrowserWindow } = require('electron')
var ipcMain = require('electron').ipcMain;
var ps = require('ps-node');
var path = require('path');
var os = require('os');
var child_process = require('child_process');

let win;
let pids = [];

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400, 
    height: 570,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, '/dist/assets/icon/64x64.png')
  })


  win.loadURL(`file://${__dirname}/dist/index.html`)

  
  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

ipcMain.on('pid-message', function(event, arg) {
  console.log('Main:', arg);
  pids.push(arg);
});

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})

// Windows App close handler
app.on('will-quit', function(event) {
  if(os.platform() === 'win32'){
    event.preventDefault();
    // child_process.exec('taskkill /pid ' + pid + ' /T /F')
    child_process.exec('taskkill /F /IM hue_ambiance.exe')
    setTimeout(function () {
      app.exit();
    }, 190);
  } 
});

// App close handler
app.on('before-quit', function() {
  pids.forEach(function(pid) {
    // A simple pid lookup
    ps.kill( pid, function( err ) {
        if (err) {
            throw new Error( err );
        }
        else {
            console.log( 'Process %s has been killed!', pid );
        }
    });
  });
});
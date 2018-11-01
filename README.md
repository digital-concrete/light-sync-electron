# Light Sync Electron

This is the UI for:

https://github.com/digital-concrete/light-sync

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.
It is based on [ElectronJS](https://electronjs.org/) and is therefore, multiplatform.

## This is a hobby project. I did not have time for thorough testing and cleanup. Please excuse possible bugs and messy code.

# Prerequisites

Node JS, NPM and Pyinstaller

Download and follow the instructions from the following repo:

https://github.com/digital-concrete/light-sync

When ready, run `pyinstaller -F light_sync.py`

Copy the result compiled file from `dist` folder to `src/assets` in the Electron app folder

Run `npm install`

# Building & Running

On Windows modify the html of Connect, Setup and Live components from ```height:calc(91% + 3px)``` to ```height:calc(91% + 0px)```

Run `npm run electron-build` for compiling

On Linux and Mac you must go into ```dist/assets``` folder and give permission for  ```light_sync``` script to be executed:

`chmod +x light_sync`

Run `npm run electron` for running the compiled app

# Packaging

Make sure you remove the ```src``` folder in order to keep package as small as possible.
App will use ```dist``` instead of ```src``` once it's compiled.

Run `npm run package-linux` for creating Linux package

Run `npm run package-win` for creating Windows package

Run `npm run package-mac` for creating Mac package


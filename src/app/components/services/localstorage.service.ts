import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    set = function (key, value) {
        (<any>window).localStorage[key] = value;
    }
    get = function (key, defaultValue) {
        return (<any>window).localStorage[key] || defaultValue;
    }
    setObject = function (key, value) {
        (<any>window).localStorage[key] = JSON.stringify(value);
    }
    getObject = function (key) {
        return JSON.parse((<any>window).localStorage[key] || null);
    }
    remove = function (key) {
        (<any>window).localStorage.removeItem(key)
    }
}

import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
  constructor() {
  }

  setStorage(name: string, val: any): void {
    if(typeof val != 'string'){
      val = JSON.stringify(val);
    }
    localStorage.setItem(name, val);
  }

  getStorage(name: string, defVal: string): string {
    return localStorage.getItem(name) || defVal;
  }
}

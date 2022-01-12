import { Router } from '@angular/router';
import { ETestType, TestType } from './../model/testType.model';
import { Test } from './../model/test.model';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Point } from '../model/point.model';
import { ELevel } from '../model/user.model';

export interface TestingStore {
  startTime: number;
  id: string;
  currentStore: number;
  timeLeft: number;
  route: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  private readonly TESTING = 'testing';

  private testing = false;

  public data: any = null;

  private readonly testing$$ = new Subject<any>();

  public testing$ = this.testing$$.asObservable();

  constructor(
    private _authService: AuthService,
    private _router: Router
    ) { }

  getCurrentState(): TestingStore {
    return JSON.parse(localStorage.getItem(this.TESTING) as string) as TestingStore;
  }

  setCurrentState(point: Point, testType: TestType, blockSeo: string): void {
    const route = ['/kiem-tra', blockSeo, testType.type === ETestType.MULTI_CHOICE ? 'trac-nghiem' : 'tu-luan', testType.id] as string[];
    const store: TestingStore = {
      startTime: point.createdDate as number,
      currentStore: new Date().getTime(),
      id: point.id as string,
      timeLeft: point.timeLeft as number * 1000,
      route
    };
    localStorage.setItem(this.TESTING, JSON.stringify(store));
  }

  notifyIfCurrentStateHasExpired(){

  }

  starting(): void {
    this.testing = true;
  }

  flushData(data: any): void {
    this.testing$$.next(data);
  }

  done(): void {
    this.testing = false;
    this.destroyState();
  }

  isTesting(): boolean {
    return this.testing;
  }

  destroy$(): void {
    this.testing$$.complete();
  }

  destroyState(): void {
    localStorage.removeItem(this.TESTING);
  }

  isExpired(): boolean {

    const currentState = this.getCurrentState();

    if(!currentState){
      return false;;
    }

    const now = new Date().getTime();
    const timeLeftNow = now - currentState?.currentStore;

    if (
      currentState &&
      timeLeftNow >= 0 &&
      timeLeftNow <= currentState?.timeLeft
    ) {
      return true;
    }
    return false;;
  }

  checkingTheTest(): void {
    if(!this._authService.isLoggedIn() || this._authService.getLevel() !== ELevel.STUDENT){
      this.done();
      return;
    }

    const currentState = this.getCurrentState();

    if(!currentState){
      return;
    }

    const now = new Date().getTime();
    const timeLeftNow = now - currentState?.currentStore;

    if (
      currentState &&
      timeLeftNow >= 0 &&
      timeLeftNow <= currentState?.timeLeft
    ) {
      this._router.navigate(this.getCurrentState().route);
    } else {
      this.done();
    }
  }
}

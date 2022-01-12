import { ChangepwsByAdmin } from './../model/changepws.model';
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

import {Observable, of, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {MessageService} from 'primeng/api';
import {IBaseService} from './ibase.service';
import {StorageService} from './storage.service';
import { NotifyService } from './notify.service';
import {ApiConstraint} from '../common/api.constraint';
import {ELevel, User} from '../model/user.model';
import { StringUtils } from '../utils/string.util';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { Changepws } from '../model/changepws.model';
import { pipe } from 'rxjs';


interface ResponseInfo {
  code: number;
  message: string;
}

export class LoginState {
  loggedIn = false;
  updateTimeInMillis = 0; // millis
  constructor(loggedId: boolean = false, updateTime: number = 0) {
    this.loggedIn = loggedId;
    this.updateTimeInMillis = updateTime;
  }
}

export class CustomState {
  data: any;
  updateTimeInMillis = 0; // millis
  constructor(data: any = {}, updateTime: number = 0) {
    this.data = data;
    this.updateTimeInMillis = updateTime;
  }
}

@Injectable()
export class UserService extends IBaseService {

  private static readonly loginStorage: string = 'LoggedIn';
  private static readonly loginState: string = JSON.stringify(new LoginState());

  isCheckLoggedIn = new Subject<boolean>();
  username: any;
  readonly validPeriodChangePassword = 60000 * 2;
  private loggedIn = false;

  constructor(
    private _http: HttpClient,
    @Inject(DOCUMENT) private document: any,
    private storage: StorageService,
    private router: Router,
    private _notifyService: NotifyService,
    private _route: Router,
  ) {
    super();
    this.checkLoginState();
  }

  login(username: string, password: string): any {
    return new Observable<string>((subscriber) => {
      const sub = this._http.post<string>(this.sendTo(ApiConstraint.LOGIN), {
        username,
        password
      }).subscribe(
        (res: any) => {
          if (res) {
            this.username = res.detail.username;
            this.markAsLoggedIn();
          }
          subscriber.next(res);
        },
        (err) => {
          this.markAsLoggedOut();
          subscriber.error(err);
        },
        () => subscriber.complete(),
      );
      return () => sub.unsubscribe();
    });
  }

  logout(): void {
    this._http.post(`/logout`, null, {}).subscribe(() => {
      this.markAsLoggedOut();
      this.router.navigateByUrl('/login');
    });
  }

  isLoggedIn(): boolean {
    this.isCheckLoggedIn.next(this.loggedIn);
    return this.loggedIn;
  }


  public markAsLoggedIn(): void {
    this.loggedIn = true;
    this.storage.setStorage(UserService.loginStorage, JSON.stringify(new LoginState(true, Date.now())));
  }


  setLocalStorageCustom(name: string, data: any): void {
    this.storage.setStorage(name, JSON.stringify(new CustomState(data, Date.now())));
  }

  public refresh(): void {
    this._http.get<any>('/auth/refresh').subscribe(data => {
      if (data) {
        this.markAsLoggedIn();
        this.storage.setStorage('token-user', data.detail.token);
      } else {
        this.markAsLoggedOut();
        window.location.reload();
      }
    });
  }

  private checkLoginState(): void {
    const loginStateStr: string = this.storage.getStorage(UserService.loginStorage, UserService.loginState);
    const loginState: LoginState = JSON.parse(loginStateStr);
    this.loggedIn = loginState.loggedIn;
    if (this.loggedIn) {
      this.username = this.storage.getStorage('username', '');
    }
  }

  private markAsLoggedOut(): void {
    this.loggedIn = false;
    this.storage.setStorage(UserService.loginStorage, UserService.loginState);
    this.storage.setStorage('token-user', '');
    this.storage.setStorage('username', '');
  }


  findAll(level: ELevel, paging?: Paging): Observable<ObjectResponsePaging<User>>{
    const params = new HttpParams()
    .set('level', level.toLocaleString());
    return this._http.get<ObjectResponsePaging<User>>(this.sendToUsingPaging(ApiConstraint.USER, paging), {params});
  }

  findAllByClassId(level: ELevel, classId: string, paging?: Paging): Observable<ObjectResponsePaging<User>>{
    const params = new HttpParams()
    .set('level', level.toLocaleString())
    .set('classId', classId);
    return this._http.get<ObjectResponsePaging<User>>(this.sendToUsingPaging(ApiConstraint.USER, paging), {params});

  }

  findAllNotPaging(level: ELevel): Observable<User[]>{
    const params = new HttpParams()
    .set('level', level.toLocaleString());
    return this._http.get<any>(this.sendToNotUsingPaging(ApiConstraint.USER), {params});
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.USER}/${id}`))
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa tài khoản không thành công!'))));
  }

  findById(id: string): Observable<User> {
    return this._http.get<User>(this.sendTo(`${ApiConstraint.USER}/${id}`));
  }

  findByIdUser(idSeo: string): Observable<User> {
    const path = StringUtils.format(ApiConstraint.API_ENPOINT_ID, idSeo);
    return this._http.get<User>(this.sendTo(path))
    .pipe(
      tap(_ => {} , _ => this._route.navigate(['/not-found']))
    );
  }

  updatePws(change: Changepws): Observable<boolean> {
    return this._http.put<boolean>(this.sendTo(`${ApiConstraint.API_ENPOINT_CHANGE_PASSWORD}`),change);
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.USER}`), ids)
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa tài khoản không thành công!'))));
  }

  save(user: User): Observable<any> {
    return this._http.post<any>(this.sendTo(`${ApiConstraint.USER}`), user)
      .pipe(
        map(res => res as User)
      );
  }

  update(user: User): Observable<any> {
    return this._http.put<any>(this.sendTo(`${ApiConstraint.USER}/${user.id}`), user)
      .pipe(
        map(res => res as User)
      );
  }

  register(user: User): Observable<any> {
    return this._http.post<any>(this.sendTo(`${ApiConstraint.REGISTER}`), user)
      .pipe(
        map(res => res as User)
      );
  }

  updateCountLogin(username: string): Observable<any> {
    return this._http.put<any>(this.sendTo(`${StringUtils.format(ApiConstraint.USER_COUNT, username)}`), {});
  }

  updatePwsByAdmin(change: ChangepwsByAdmin): Observable<boolean> {
    return this._http.put<boolean>(this.sendTo(ApiConstraint.API_ENPOINT_CHANGE_PASSWORD_ADMIN),change);
  }

}

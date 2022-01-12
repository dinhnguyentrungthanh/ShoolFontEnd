import { ELevel } from 'src/app/@core/model/user.model';
import { ApiConstraint } from './../common/api.constraint';
import { IBaseService } from './ibase.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, Observable, BehaviorSubject} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';

import {Tokens} from '../model/tokens';
import { User } from '../model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService extends IBaseService{

  public readonly JWT_TOKEN = 'JWT_TOKEN';
  public readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  public readonly USERNAME = 'USERNAME';
  public readonly ROLES = 'roles';
  public readonly LEVEL = 'level';
  private readonly FULLNAME ='fullname';
  private readonly AVATAR ='avatar';
  private readonly ID = 'id';
  private loggedUser: any;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;


  constructor(
    private http: HttpClient,
    private _jwtHelperService: JwtHelperService
    ) {
    super();
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') as string));
    this.user = this.userSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  refreshToken(): Observable<any>{
    return this.http.post<any>(this.sendTo(ApiConstraint.REFRESH), {
      refreshToken: this.getJwtToken()
    },{
      headers: {
        isRefreshToken: 'true'
      }
    }
    ).pipe(tap((res: any) => {
      this.storeTokens(res);
    }));
  }

  getJwtToken(): string {
    return localStorage.getItem(this.JWT_TOKEN) as string;
  }

  private storeTokens(res: any): void {
      localStorage.setItem(this.JWT_TOKEN, res.detail.token);
      localStorage.setItem(this.USERNAME, res.detail.username);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USERNAME);

  }

  public getRoles(): string[]{
    return this.getDecodeToken()[this.ROLES] || [];
  }

  public getDecodeToken(): any{
    return this._jwtHelperService.decodeToken(this.getJwtToken());
  }

  public getLevel(): ELevel {
    if(!this.getDecodeToken()){
      return ELevel.ANONYMOUS;
    }
    return this.getDecodeToken()[this.LEVEL] || null;
  }

  public getFullname(): string {
    return this.getDecodeToken()[this.FULLNAME] || null;
  }

  public getAvatar(): string {
    return this.getDecodeToken()[this.AVATAR] || null;
  }

  public getId(): string {
    return this.getDecodeToken()[this.ID] || null;
  }

  isAuthorized(allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

  // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    return [...this.getRoles()].filter(role => allowedRoles.includes(role)).length > 0;
  }

  hasLevel(allowedLevels: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedLevels == null || allowedLevels.length === 0) {
      return true;
    }

  // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    return allowedLevels.includes(this.getLevel());
  }

}


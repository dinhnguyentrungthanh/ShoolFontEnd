import { UserConstraint } from 'src/app/@core/common/user.constraint';
import { Router } from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import { catchError, filter, take, switchMap, retry, concatMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { NotifyService } from '../service/notify.service';
import { Route } from '@angular/compiler/src/core';
import { ELevel } from '../model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public authService: AuthService,
    private _notifyService: NotifyService,
    private _router: Router,
    private _jwtHelper: JwtHelperService
    ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }

    return next.handle(request)
    .pipe(
      retry(1),
      catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401){
          return this.handle401Error(request, next);
        }
        if (error.status === 403){
          return this.handle403Error(request, next);
        }
        if (error.status === 500){
          return this.handle500Error(request, next);
        }
      }
      return throwError(error);
    }));
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const level = this.authService.getLevel();
    console.log('token is invalid => ', this._jwtHelper.isTokenExpired());
    if (this._jwtHelper.isTokenExpired() && level !== ELevel.STUDENT && level !== ELevel.ANONYMOUS) {
      return this.authService.refreshToken().pipe(
        concatMap((res: any) => next.handle(this.addToken(request, res.default.token))));

    } else {
      this._router.navigate([UserConstraint.LOGIN]);
      return next.handle(request);
    }
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
    if(this._jwtHelper.isTokenExpired()){
      const level = this.authService.getLevel();
      if (level !== ELevel.STUDENT && level !== ELevel.ANONYMOUS) {
        return this.authService.refreshToken().pipe(
          concatMap((res: any) => next.handle(this.addToken(request, res.detail.token))));

      }else{
        this._router.navigate([UserConstraint.LOGIN]);
        return next.handle(request);
      }
    } else {
      this._notifyService.showError('Không có quyền truy cập');
      return next.handle(request);
    }
  }

  private handle500Error(request: HttpRequest<any>, next: HttpHandler) {
    this._notifyService.showError('Hệ thống đang bảo trì');
    return next.handle(request);
  }

}

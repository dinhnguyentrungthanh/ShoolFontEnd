import { UserConstraint } from './../common/user.constraint';
import { AuthService } from 'src/app/@core/service/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminConstraint } from '../common/admin.constraint';
import { ELevel } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate, CanActivateChild {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this._authService.isLoggedIn()) {
        this._authService.removeTokens();
        this._router.navigate([UserConstraint.LOGIN]);
        return false;
      }

      const isStudent = this._authService.getLevel() === ELevel.STUDENT;

      if (!isStudent) {
        // if not authorized, show access denied message
        this._router.navigate([UserConstraint.ACCESS_DENIED]);
      }

      return isStudent;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isStudent = this._authService.getLevel() === ELevel.STUDENT;

      if (!isStudent) {
        // if not authorized, show access denied message
        this._router.navigate([UserConstraint.ACCESS_DENIED]);
      }
      return isStudent;
  }

}

import { ELevel } from 'src/app/@core/model/user.model';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminConstraint } from '../common/admin.constraint';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate, CanActivateChild {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._authService.isLoggedIn() && this._authService.getLevel() !== ELevel.STUDENT) {
        this._router.navigate([AdminConstraint.DASHBOARD]);
        return false;
      }
      this._authService.removeTokens();
      return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._authService.isLoggedIn() && this._authService.getLevel() !== ELevel.STUDENT) {
        this._router.navigate([AdminConstraint.DASHBOARD]);
        return false;
      }
      return true;
  }

}

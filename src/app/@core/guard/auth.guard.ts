import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { AdminConstraint } from '../common/admin.constraint';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private _authService: AuthService,
    private _router: Router
    ) {}
  // eslint-disable-next-line max-len
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (!this._authService.isLoggedIn()) {
      this._authService.removeTokens();
      this._router.navigate([AdminConstraint.LOGIN]);
      return false;
    }

    const allowedRoles = route.data.allowedRoles;
    const isAuthorized = this._authService.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      // if not authorized, show access denied message
      this._router.navigate([AdminConstraint.ACCESS_DENIED]);
    }

    return isAuthorized;
  }

  // eslint-disable-next-line max-len
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const allowedRoles = childRoute.data.allowedRoles;
    const isAuthorized = this._authService.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      this._router.navigate([AdminConstraint.ACCESS_DENIED]);
    }
    return isAuthorized;
  }

}

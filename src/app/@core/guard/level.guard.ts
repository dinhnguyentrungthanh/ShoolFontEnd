import { ELevel } from 'src/app/@core/model/user.model';
import { AuthService } from 'src/app/@core/service/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminConstraint } from '../common/admin.constraint';

@Injectable({
  providedIn: 'root'
})
export class LevelGuard implements CanActivate, CanActivateChild {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const allowedLevels = route.data.allowedLevel;
      const hasLevel = this._authService.hasLevel(allowedLevels);
      if (!hasLevel) {
        // if not Level, show access denied message
        this._router.navigate([AdminConstraint.ACCESS_DENIED]);
      }

      return hasLevel;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const allowedLevel = childRoute.data.allowedLevel;
      const hasLevel = this._authService.hasLevel(allowedLevel);
      if (hasLevel) {
        // if not Level, show access denied message
        this._router.navigate([AdminConstraint.ACCESS_DENIED]);
      }

      return hasLevel;
  }

}

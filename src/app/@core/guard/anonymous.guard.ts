import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserConstraint } from '../common/user.constraint';
import { ELevel } from '../model/user.model';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate, CanActivateChild {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._authService.getLevel() !== ELevel.ANONYMOUS && this._authService.getLevel() !== ELevel.STUDENT){
        this._authService.removeTokens();
        this._router.navigate([UserConstraint.LOGIN]);
        return false;
      }

      return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._authService.getLevel() !== ELevel.ANONYMOUS && this._authService.getLevel() !== ELevel.STUDENT){
        this._authService.removeTokens();
        this._router.navigate([UserConstraint.LOGIN]);
        return false;
      }
      return true;
  }

}

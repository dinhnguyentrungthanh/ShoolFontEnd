import { Subscription } from 'rxjs';
import { AdminConstraint } from 'src/app/@core/common/admin.constraint';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/service/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaQuery } from 'src/app/@core/model/media-query';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit, OnDestroy {

  isExpandMenu = true;
  isDisplaySiderbarRight = false;
  isDesktop = true;
  private mediaService = new MediaQuery('(min-width: 992px)');
  subcription!: Subscription;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ){}

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  ngOnInit(): void {
    this.subcription = this.mediaService.match$.subscribe((value: boolean) => {
      this.isExpandMenu = value;
      this.isDesktop = value;
    });
  }

  onMenuState(value: boolean): void{
    this.isExpandMenu = value;
  }

  onSibarRightState(value: boolean): void {
    this.isDisplaySiderbarRight = value;
  }

  logout(event: boolean): void{
    this._authService.removeTokens();
    this._router.navigate([AdminConstraint.LOGIN]);
  }

}

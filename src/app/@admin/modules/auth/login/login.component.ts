import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { switchMap, tap } from 'rxjs/operators';
import { AdminConstraint } from 'src/app/@core/common/admin.constraint';
import { ELevel, User } from 'src/app/@core/model/user.model';

import { AuthService } from 'src/app/@core/service/auth.service';
import { StorageService } from 'src/app/@core/service/storage.service';
import { UserService } from 'src/app/@core/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  users!: User[];

  user!: User;
  errMsg: Message[] = [];

  count!: number;

  loading = false;

  constructor(private authService: AuthService,
    private storage: StorageService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
  }

  validateData(): boolean {
    if (!this.username) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui lòng nhập tài khoản' }];
      return false;
    }
    if (!this.password) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui lòng nhập mật khẩu' }];
      return false;
    }
    return true;
  }

  login() {

    this.loading = true;

    if (!this.validateData()) {
      this.loading = false;
      return;
    }

    this.primengConfig.ripple = true;
    this.userService.login(this.username, this.password)
      .pipe(
        tap((data: any) => this.saveDataToLocalstorage(data)),
        switchMap(_ => this.userService.updateCountLogin(this.username))
      )
      .subscribe((_: any) => {
        if (this.authService.getLevel() as string == "TEACHER") {
          this.router.navigateByUrl(AdminConstraint.DASHBOARDTEACHER);
        } else {
          this.router.navigateByUrl(AdminConstraint.DASHBOARD);
        }
      },
        (err: any) => {
          this.loading = false;
          this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Tài Khoản hoặc Mật Khẩu không đúng' }];
        });
  }

  register(): void {
    this.router.navigateByUrl(AdminConstraint.REGISTER);
  }

  saveDataToLocalstorage(data: any): void {
    this.storage.setStorage(this.authService.JWT_TOKEN, data.detail.token);
    this.storage.setStorage(this.authService.USERNAME, data.detail.username);
  }

}

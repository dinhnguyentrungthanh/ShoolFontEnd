import { AdminConstraint } from './../../../../@core/common/admin.constraint';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../@core/service/auth.service';
import { StorageService } from '../../../../@core/service/storage.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ELevel, User } from '../../../../@core/model/user.model';
import { UserService } from '../../../../@core/service/user.service';
import { NotifyService } from '../../../../@core/service/notify.service';
import { Message } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ClassService } from 'src/app/@core/service/class.service';
import { Class } from 'src/app/@core/model/base.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  users!: User[];
  rePassword = '';
  errMsg: Message[] = [];

  classe!: Class;

  classes!: Class[];

  gender: any[] = [
    { name: 'Nam', code: '1' },
    { name: 'Nữ', code: '0' }
  ];

  form!: FormGroup;

  constructor(private auth: AuthService,
    private storage: StorageService,
    private router: Router,
    private _userService: UserService,
    private _notifyService: NotifyService,
    private _classesService: ClassService) {
  }

  ngOnInit(): void {
    this.fetchClasses();
    this.clearorm();
  }

  private fetchClasses(c?: User): void {
    this._userService.findAllNotPaging(ELevel.STUDENT).subscribe(data => {
      this.classes = data;
      if (c) {
        this.classe = this.classes.find(classe => classe.id == ((c.classes as Class).id)) as Class;
      }
    });
  }


  register(): void {
    this.auth.removeTokens();
    if (!this.validateInput()) { return; }
    this.storage.setStorage('', null);
    //hard code
    this.user.status = 1;
    this.user.level = ELevel.STUDENT;
    /*    this.user.classes = new Set<string>().add('finn');*/
    this._userService.register(this.user)
      .pipe(
        tap((u: User) => {
          this.errMsg = [{ severity: 'success', summary: 'Thông Báo', detail: 'Đăng Kí Thành Công Tài Khoản' }];
          this.clearorm();
        }))
      .subscribe((data) => {
      }, err => {
        this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Đăng Kí Không Thành Công Tài Khoản' }];
      });
  }

  login(): void {
    this.router.navigateByUrl(AdminConstraint.LOGIN);
  }

  validateInput(): boolean {
    if (!this.user.username || !this.user.password || !this.rePassword) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Tài khoản và mật khẩu không được để trống' }];
      return false;
    } else if (this.user.password !== this.rePassword) {
      this.errMsg = [{
        severity: 'error',
        summary: 'Thông Báo',
        detail: 'Mật khẩu và xác nhận mật khẩu phải giống nhau!'
      }];
      return false;
    } else if (!this.user.phone) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui lòng nhập số điện thoại!' }];
      return false;
    } else if (!this.gender) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui lòng chọn giới tính!' }];
      return false;
    } else if (!this.user.fullname) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui lòng nhập đầy đủ họ tên!' }];
      return false;
    } else if (!this.classes) {
      this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui lòng chọp lớp!' }];
      return false;
    }
    return true;
  }

  clearorm(): void {
    this.user = {};
    this.rePassword = '';
    this.user.password = '';
  }
}

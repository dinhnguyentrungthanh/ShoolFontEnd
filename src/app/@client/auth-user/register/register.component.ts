import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { Class } from 'src/app/@core/model/base.class';
import { ELevel, User } from 'src/app/@core/model/user.model';
import { AuthService } from 'src/app/@core/service/auth.service';
import { ClassService } from 'src/app/@core/service/class.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { StorageService } from 'src/app/@core/service/storage.service';
import { UserService } from 'src/app/@core/service/user.service';

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

  popup !: boolean;

  messagePopup!: String;


  selectedClass!: Class;

  constructor(
    private auth: AuthService,
      private storage: StorageService,
      private router: Router,
      private _userService: UserService,
      private _notifyService: NotifyService,
      private _classesService: ClassService
  ) { }

  ngOnInit(): void {
    this.fetchClasses();
    this.clearorm();
  }

  private fetchClasses(): void {
    this._classesService.findAllNotPaging()
    .pipe()
    .subscribe(data => {
      this.classes = data;
    });
  }

  register(): void {

    //this.user.classes?.add(this.selectedClass.id as string);

    this.auth.removeTokens();
    if (!this.validateInput()) { return; }
    this.storage.setStorage('', null);
    //hard code
    this.user.status = 1;
    this.user.level = ELevel.STUDENT;
    const set = new Set<string>();
    set.add(this.selectedClass.id as string);
    console.log(this.selectedClass.id as string, set);
    this.user.classes = set;
    this._userService.register(this.user)
      .pipe(
        tap((u: User) => {
          this.popup =true;
          this.messagePopup = 'Đăng kí thành công Tài Khoản';
          this.clearorm();
        }))
      .subscribe((data) => {
      }, err => {
        this.errMsg = [{ severity: 'error', summary: 'Thông Báo', detail: 'Đăng Kí Không Thành Công Tài Khoản' }];
      });
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



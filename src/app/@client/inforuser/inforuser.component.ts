/* eslint-disable @typescript-eslint/no-unused-expressions */

import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Changepws } from 'src/app/@core/model/changepws.model';
import { ELevel, User } from 'src/app/@core/model/user.model';
import { AuthService } from 'src/app/@core/service/auth.service';
import { ClassService } from 'src/app/@core/service/class.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { UploadFileService } from 'src/app/@core/service/upload-file.service';
import { UserService } from 'src/app/@core/service/user.service';
import { ValidateEmail, ValidatePhone } from 'src/app/@core/utils/FnValidator';

@Component({
  selector: 'app-inforuser',
  templateUrl: './inforuser.component.html',
  styleUrls: ['./inforuser.component.scss']
})
export class InforuserComponent implements OnInit {

  disabled = true;

  isExistedUsername = false;

  idSeo = '';

  students!: User[];

  student: User = {};

  defaultDate: Date = new Date();

  genders = [
    { name: 'Nam', code: 1 },
    { name: 'Nữ', code: 0 },
  ];

  repeatPws !: string;

  submitted!: boolean;

  form!: FormGroup;

  uploadProgress!: number;
  uploadSub: Subscription | undefined;
  file: any;

  errMsgUpdate: Message[] = [];

  errMsgAvatar: Message[] = [];

  errMsgChangePs: Message[] = [];

  isEditing = false;

  changePwsDialog = false;

  changepw !: Changepws;

  rePassword = '';


  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _notifyService: NotifyService,
    private _helperService: HelperService,
    private _uploadFileService: UploadFileService,
    private _classService: ClassService,
    private _fb: FormBuilder,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.fetchData();

  }

  get f() {
    return this.form.controls;
  }
  private fetchData() {
    this.isEditing = true;
    this.file = null;
    this.isExistedUsername = false;
    this.idSeo = this.authService.getId();
    this._userService
      .findByIdUser(
        this.idSeo
      ).
      subscribe((data: User) => {
        data.birthday = new Date(data.birthday as number);
        this.student = data;
      });
    this.form = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      phone: ['', [Validators.required, ValidatePhone]],
      email: ['', [Validators.required, ValidateEmail]],
      fullname: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      birthday: ['', [Validators.required]],
    });
  }

  updateStudent(): void {

    if (this.form.invalid) {
      this.errMsgUpdate = [{ severity: 'error', summary: 'Thông Báo', detail: 'Vui long kiểm tra lạ thông tin' }];
      return;
    }
    this.isExistedUsername = false;
    this.student.level = ELevel.STUDENT;
    this.student.roles = [];
    this.student.roleGroups =[];
    this._userService
      .update(this.student)
      .pipe(
        take(1),
        tap((u: User) => {
          this.errMsgUpdate = [{ severity: 'success', summary: 'Thông Báo', detail: 'Cập nhật tài khoản thành công' }];
        })
      )
      .subscribe((data: User) => {
        data.birthday = new Date(data.birthday as number);
        this.student = data;
      }),
      (err: HttpErrorResponse) => {
        if (err.status === 500) {
          this._notifyService.showError(`${err.error.message}`);
        }
        if (err.status === 400) {
          this.isExistedUsername = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      };
  }

  saveAvatar(files: any): void {
    this.uploadSub = this._uploadFileService
      .uploadAvatar(this.student.id, files)
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(
            100 * (event.loaded / event.total)
          );
        }
        if (event.type === HttpEventType.Response) {
          this.errMsgAvatar = [{ severity: 'success', summary: 'Thông Báo', detail: 'Cập nhật ảnh đại diện thành công' }];
        }
      })
      .add((_: any) => this.reset());
  }

  reset(): void {
    this.uploadProgress = 0;
    this.uploadSub?.unsubscribe();
    this.uploadSub = undefined;
  }

  changePass() {
    this.changePwsDialog = true;
    this.changepw = {};
    this.rePassword = '';
}

  chanePws(): void{
    if (!this.validateInput()) { return; }
   this.changepw.id = this.authService.getId();
    this._userService.updatePws(this.changepw)
    .subscribe(data => {
      if(data == true){
        this.changePwsDialog = false;
        this.errMsgChangePs = [{ severity: 'success', summary: 'Thông Báo', detail: 'Cập nhật mật khẩu thành công' }];
      }
    }),
    (err: HttpErrorResponse) => {
      if (err.status === 500) {
        this._notifyService.showError(`${err.error.message}`);
      }
      if (err.status === 400) {
        this.isExistedUsername = true;
        this._notifyService.showError(`${err.error.message}`);
      }
    };

}

validateInput(): boolean {
  if ( !this.changepw.newPassword || !this.rePassword || !this.changepw.oldPassword) {
    this.errMsgChangePs = [{ severity: 'error', summary: 'Thông Báo', detail: ' Các Mật Khẩu không được để trống' }];
    return false;
  }
  else if (this.rePassword !== this.changepw.newPassword) {
    this.errMsgChangePs = [{
      severity: 'error',
      summary: 'Thông Báo',
      detail: 'Mật khẩu và xác nhận mật khẩu phải giống nhau!'
    }];
    return false;
  }
  else if (this.changepw.newPassword.length < 5 ) {
    this.errMsgChangePs = [{ severity: 'error', summary: 'Thông Báo', detail: ' Mật Khẩu phải tồn tại 5 kí tự trở lên' }];
    return false;
  }
  else if (this.changepw.newPassword ===  this.changepw.oldPassword) {
    this.errMsgChangePs = [{ severity: 'error', summary: 'Thông Báo', detail: ' Mật Khẩu Mới không được giống Mật Khẩu Cũ' }];
    return false;
  }
  return true;
}

}


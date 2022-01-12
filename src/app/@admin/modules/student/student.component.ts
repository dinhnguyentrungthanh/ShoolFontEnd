import { ChangepwsByAdmin } from './../../../@core/model/changepws.model';
import { Class } from 'src/app/@core/model/base.class';
import { HelperService } from './../../../@core/service/helper.service';
import { ELevel } from './../../../@core/model/user.model';
import { User } from 'src/app/@core/model/user.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { UserService } from 'src/app/@core/service/user.service';
import { ValidatePhone, ValidateEmail } from 'src/app/@core/utils/FnValidator';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { map, tap, switchMap, take, concatMap } from 'rxjs/operators';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { of, Subscription } from 'rxjs';
import { UploadFileService } from 'src/app/@core/service/upload-file.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ClassService } from 'src/app/@core/service/class.service';
import { cpuUsage } from 'process';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent extends PagingFunction implements OnInit {

  isExistedUsername = false;

  isEditing = false;

  defaultDate: Date = new Date();

  userDialog!: boolean;

  students!: User[];

  student!: User;

  selectedStudents!: User[];

  genders = [
    { name: 'Nam', code: 1 },
    { name: 'Nữ', code: 0 },
  ];

  submitted!: boolean;

  form!: FormGroup;

  uploadProgress!: number;

  uploadSub: Subscription | undefined;

  file: any;

  classes: Class[] = [];

  selectedClasses: Class[] | string[] = [];

  loading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder,
    private _helperService: HelperService,
    private _uploadFileService: UploadFileService,
    private _classService: ClassService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchAllData();
    this.fetchClass();
  }

  get f() {
    return this.form.controls;
  }

  private fetchClass(): void {
    this._classService.findAllNotPaging().subscribe((data) => {
      this.classes = data;
    },_ => this.loading = false);
  }

  private fetchAllData(): void {
    this.loading = true;
    this._userService
      .findAll(ELevel.STUDENT)
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<User>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        map((users: User[]) =>
          users.map((u: User) => {
            u.birthday = new Date(u.birthday as number);
            return u;
          })
        )
      )
      .subscribe((data: User[]) => {
        this.students = data;
        this.loading = false;
      },_ => this.loading = false);
  }

  openNew(): void {
    this.student = {};
    this.submitted = false;
    this.userDialog = true;
    this.isExistedUsername = false;
    this.isEditing = false;
    this.file = null;
    this.selectedClasses = [];
    this.form = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      phone: ['0900000000', [Validators.required, ValidatePhone]],
      email: ['tranphu@onluyentoanthcs.com', [Validators.required, ValidateEmail]],
      fullname: [
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

  deleteselectedStudents(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn các xóa Khối này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers(),
    });
  }

  private handlerDeleteMultiUsers(): void {
    this.students = this.students.filter(
      (val) => !this.selectedStudents.includes(val)
    );

    const ids = [...this.selectedStudents].map((u: User) => u.id as string);

    this.selectedStudents = [];

    this._userService
      .deleteByIds(ids)
      .pipe(map(Mapping.toResponeDeletedByIds))
      .subscribe((data) => {
        if (data.successes.length) {
          this._notifyService.showSuccess(
            `Đã xóa các tài khoản: ${data.successes.join(', ')} thành công!`
          );
        }
        if (data.errors.length) {
          this._notifyService.showError(
            `Không thể xóa các tài khoản: ${data.successes.join(', ')}!`
          );
        }
      });
  }

  editUser(user: User): void {
    this.student = { ...user };
    this.userDialog = true;
    this.isExistedUsername = false;
    this.submitted = false;
    this.isEditing = true;
    this.file = null;
    this.form = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      phone: ['0900000000', [Validators.required, ValidatePhone]],
      email: ['tranphu@onluyentoanthcs.com', [Validators.required, ValidateEmail]],
      fullname: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      birthday: ['', [Validators.required]],
    });
    this.selectedClasses = this.classes
      .filter((c) =>
        [...(this.student.classes as string[])].includes(c.id as string)
      )
      .map((c) => c.id) as string[];
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa <b>' + user.username + '</b> ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(user),
    });
  }

  handlerDelete(user: User): void {
    this._userService
      .deleteById(user.id)
      .pipe(
        take(1),
        tap((_) => this._notifyService.showSuccess('Xóa tài khoản thành công')),
        switchMap((_) => this._userService.findAll(ELevel.STUDENT)),
        switchMap((obj: ObjectResponsePaging<User>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        map((users: User[]) =>
          users.map((u: User) => {
            u.birthday = new Date(u.birthday as number);
            return u;
          })
        )
      )
      .subscribe((data: User[]) => {
        this.students = data;
      });
  }

  hideDialog(): void {
    this.userDialog = false;
    this.submitted = false;
    this.isEditing = false;
  }

  saveStudent(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return;
    }

    this.student.phone = '0900000000';
    this.student.email = 'tranphu@onluyentoanthcs.com';
    this.isExistedUsername = false;
    this.student.level = ELevel.STUDENT;
    this.student.classes = [...this.selectedClasses] as string[];

    this._userService
      .save(this.student)
      .pipe(
        take(1),
        concatMap((u: User) => {

          this.hideDialog();
          this._notifyService.showSuccess(
            `Tạo học viên ${u.username} thành công`
          );

          if (!this.file) {
            return of(u);
          }
          return this._uploadFileService.uploadAvatar(u.id, this.file);
        }),
        switchMap((_) => this._userService.findAll(ELevel.STUDENT)),
        switchMap((obj: ObjectResponsePaging<User>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        map((users: User[]) =>
          users.map((u: User) => {
            u.birthday = new Date(u.birthday as number);
            return u;
          })
        )
      )
      .subscribe(
        (data: User[]) => {
          this.students = data;
        },
        (err) => {
          if (err.status === 500) {
            this._notifyService.showError(`${err.error.message}`);
          }
          if (err.status === 400) {
            this.isExistedUsername = true;
            this._notifyService.showError(`${err.error.message}`);
          }
        }
      );
  }

  updateStudent(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return;
    }

    this.isExistedUsername = false;
    this.student.level = ELevel.STUDENT;
    this.student.classes = [...this.selectedClasses] as string[];

    this._userService
      .update(this.student)
      .pipe(
        take(1),
        tap((u: User) => {
          this.hideDialog();
          this._notifyService.showSuccess(
            `Cập nhật học viên ${u.username} thành công`
          );
        }),
        switchMap((_) => this._userService.findAll(ELevel.STUDENT)),
        switchMap((obj: ObjectResponsePaging<User>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        map((users: User[]) =>
          users.map((u: User) => {
            u.birthday = new Date(u.birthday as number);
            return u;
          })
        )
      )
      .subscribe(
        (data: User[]) => {
          this.students = data;
        },
        (err: HttpErrorResponse) => {
          if (err.status === 500) {
            this._notifyService.showError(`${err.error.message}`);
          }
          if (err.status === 400) {
            this.isExistedUsername = true;
            this._notifyService.showError(`${err.error.message}`);
          }
        }
      );
  }

  onSelected(students: User[]): void {
    this.selectedStudents = students;
  }

  onPagingChange(paging: Paging): void {
    this._userService
      .findAll(ELevel.STUDENT, paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<User>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.students = data;
      });
  }

  saveAvatar(files: any): void {
    if (this.isEditing) {
      this.uploadSub = this._uploadFileService
        .uploadAvatar(this.student.id, files)
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              100 * (event.loaded / event.total)
            );
          }
          if (event.type === HttpEventType.Response) {
            this._notifyService.showSuccess(
              `Cập nhật ảnh đại diện thành công!`
            );
            this.fetchAllData();
          }
        })
        .add((_: any) => this.reset());
    } else {
      this.file = files;
    }
  }

  reset(): void {
    this.uploadProgress = 0;
    this.uploadSub?.unsubscribe();
    this.uploadSub = undefined;
    this.file = undefined;
    this.hideDialog();
  }

  formPass!: FormGroup;
  isShowDialogChangePW = false;

  onChangePassword(u: User): void {
    this.student = u;
    this.submitted = false;

    this.formPass = this._fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      renewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
    });

    this.isShowDialogChangePW = true;
  }

  changePassword(){
    this.submitted = true;

    const p = this.formPass.controls.newPassword.value;
    const rP = this.formPass.controls.renewPassword.value;

    if(this.formPass.invalid || p !== rP){
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const data: ChangepwsByAdmin = {
      password: p as string,
      user: this.student.id as string
    };

    this._userService.updatePwsByAdmin(data)
    .subscribe((_) => {
      this._notifyService.showSuccess(
        `Cập nhật mật khẩu thành công!`
      );
      this.isShowDialogChangePW = false;
    },
    (err: HttpErrorResponse) => {
      if (err.status === 500) {
        this._notifyService.showError(`${err.error.message}`);
      }
      if (err.status === 400) {
        this.isExistedUsername = true;
        this._notifyService.showError(`${err.error.message}`);
      }
    });
  }
}

import { ChangepwsByAdmin } from './../../../../@core/model/changepws.model';
import { PagingFunction } from './../../../../@core/utils/PagingFunction';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, of, Subscription } from 'rxjs';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { Class } from 'src/app/@core/model/base.class';
import { Block } from 'src/app/@core/model/block.model';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { ELevel, User } from 'src/app/@core/model/user.model';
import { ClassService } from 'src/app/@core/service/class.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { UploadFileService } from 'src/app/@core/service/upload-file.service';
import { UserService } from 'src/app/@core/service/user.service';
import { ValidatePhone, ValidateEmail } from 'src/app/@core/utils/FnValidator';
import { Mapping } from 'src/app/@core/utils/mapping.util';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss'],
})
export class ClassDetailComponent extends PagingFunction implements OnInit {
  classId!: string;

  classDialog!: boolean;

  class!: Class;

  block!: Block;

  submitted!: boolean;

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

  form!: FormGroup;

  uploadProgress!: number;
  uploadSub: Subscription | undefined;
  file: any;

  classes: Class[] = [];
  selectedClasses: Class[] | string[] = [];

  constructor(
    private _route: ActivatedRoute,
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
    this._route.params
      .pipe(
        tap((params) => (this.classId = params.id)),
        concatMap((params) => this._classService.findById(params.id as string)),
        //switchMap((c: Class) => this._helperService.queryUsersFromClass(c)),
        switchMap((c: Class) => this._helperService.queryBlockFromClass(c)),
        tap((c: Class) => this.bindData(c)),
        switchMap((c: Class) => this._userService.findAllByClassId(ELevel.STUDENT, c.id as string)),
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
      .subscribe((data) => {
        this.students = data;
      });

    this.fetchClass();
  }

  private bindData(c: Class): void {
    this.class = c; //nó set gua tri o day
    this.block = this.class.block as Block;
    //this.students = c.users as User[];
  }

  get f() {
    return this.form.controls;
  }

  private reloadData() {
    of(this.classId)
      .pipe(
        concatMap((id) => this._classService.findById(id as string)),
        switchMap((c: Class) => this._helperService.queryBlockFromClass(c)),
        tap((c: Class) => this.bindData(c)),
        switchMap((c: Class) => this._userService.findAllByClassId(ELevel.STUDENT, c.id as string)),
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
      .subscribe((data) => {
        this.students = data;
        this.selectedStudents = [];
      });
  }

  private fetchClass(): void {
    this._classService.findAllNotPaging().subscribe((data) => {
      this.classes = data;
    });
  }

  deleteselectedStudents(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn chác xóa Học Sinh này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers(),
    });
  }

  private handlerDeleteMultiUsers(): void {
    const ids = [...this.selectedStudents].map((u: User) => u.id as string);

    this.selectedStudents = [];

    this._classService
      .deleteUsersFromClassByIds(this.classId, ids)
      .pipe(take(1), map(Mapping.toResponeDeletedByIds))
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
        this.reloadData();
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
      email: [
        'tranphu@onluyentoanthcs.com',
        [Validators.required, ValidateEmail],
      ],
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
      message: 'Bạn có chắc chắn xóa ' + user.username + ' ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(user),
    });
  }

  handlerDelete(user: User): void {
    this._classService
      .deleteUserFromClassById(this.classId, user.id as string)
      .pipe(
        take(1),
        tap((_) => this._notifyService.showSuccess('Xóa Học Sinh thành công')),
        switchMap((_) => this._userService.findAllByClassId(ELevel.STUDENT, this.classId)),
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
        switchMap((_) => this._userService.findAllByClassId(ELevel.STUDENT, this.classId)),
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
      .findAllByClassId(ELevel.STUDENT, this.classId, paging)
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
    this.uploadSub = this._uploadFileService
      .uploadAvatar(this.student.id, files)
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
        if (event.type === HttpEventType.Response) {
          this._notifyService.showSuccess(
            `Cập nhật ảnh đại diện thành công thành công!`
          );
          this.reloadData();
        }
      })
      .add((_: any) => this.reset());
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

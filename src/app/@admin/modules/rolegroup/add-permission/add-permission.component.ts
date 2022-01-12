import { NotifyService } from 'src/app/@core/service/notify.service';
import { RolegroupService } from 'src/app/@core/service/rolegroup.service';
import { UserService } from 'src/app/@core/service/user.service';
import { Rolegroup } from 'src/app/@core/model/rolegroup.model';
import { User, ELevel } from 'src/app/@core/model/user.model';
import { Component, OnInit } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent implements OnInit {
  teachers: User[] = [];

  selectedTeacher!: User | undefined;

  roleGroupUsers: Rolegroup[] = [];

  selectedRoleGroupUsers!: User[];

  levels = Object.values(ELevel).filter(e => e !== ELevel.STUDENT && e !== ELevel.ANONYMOUS);

  selectedLevel!: ELevel | undefined;

  constructor(
    private _userService: UserService,
    private _roleGroupService: RolegroupService,
    private _notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    this.fetchTeacher();
    this.fetchAll();
  }

  private fetchTeacher(): void {
    const teacher$ = this._userService
      .findAllNotPaging(ELevel.TEACHER)
      .pipe(take(1));
    const director$ = this._userService
      .findAllNotPaging(ELevel.DIRECTOR)
      .pipe(take(1));
    const admin$ = this._userService
      .findAllNotPaging(ELevel.ADMINISTRATOR)
      .pipe(take(1));
    forkJoin([teacher$, director$, admin$])
      .pipe(
        map(([teacher, director, admin]) => [...teacher, ...director, ...admin].filter(r => r.username !== 'admin'))
      )
      .subscribe((teachers: User[]) => (this.teachers = teachers));
  }
  private fetchAll(): void {
    this._roleGroupService
      .findAllNotPaging()
      .pipe(take(1))
      .subscribe((data) => {
        this.roleGroupUsers = data;
      });
  }

  onChangeTeacher(): void {
    if (this.selectedTeacher) {
      this.selectedRoleGroupUsers = [...this.roleGroupUsers].filter((r) =>
        ((this.selectedTeacher as User).roleGroups as Array<string>).includes(
          r.id as string
        )
      ) as User[];

      this.selectedLevel = this.selectedTeacher.level as ELevel;
    }
  }

  updateUserRoleGroup() {
    if (this.selectedTeacher) {
      const data = { ...this.selectedTeacher };
      data.roleGroups = this.selectedRoleGroupUsers.map(
        (r) => r.id
      ) as string[];
      data.level = this.selectedLevel;
      this._userService
        .update(data)
        .pipe(take(1))
        .subscribe(
          (u: User) => {
            this._notifyService.showSuccess(
              `Cập nhật ${u.fullname} thành công`
            );
            this.fetchAll();
            this.selectedTeacher = undefined;
            this.selectedRoleGroupUsers = [];
            this.selectedLevel = undefined;
          },
          (u: User) => {
            this._notifyService.showError(
              `Cập nhật ${u.fullname} không thành công`
            );
          }
        );
    }
  }
}

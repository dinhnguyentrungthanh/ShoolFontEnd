import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { Role } from 'src/app/@core/model/role.model';
import { Rolegroup } from 'src/app/@core/model/rolegroup.model';
import { ELevel, User } from 'src/app/@core/model/user.model';
import { HelperService } from 'src/app/@core/service/helper.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { RoleService } from 'src/app/@core/service/role.service';
import { RolegroupService } from 'src/app/@core/service/rolegroup.service';
import { UserService } from 'src/app/@core/service/user.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import {
  PagingFunction,
  TablePagingFunction,
} from 'src/app/@core/utils/PagingFunction';

export interface ObjectListBox<T> {
  label: string;
  value: T;
  items?: Array<ObjectListBox<T>>;
  url?: string;
  routerLink?: any;
}

@Component({
  selector: 'app-rolegroup',
  templateUrl: './rolegroup.component.html',
  styleUrls: ['./rolegroup.component.scss'],
})
export class RolegroupComponent extends PagingFunction implements OnInit {
  isExistedName = false;

  isEditing = false;

  roleGroupDialog!: boolean;

  roleGroups!: Rolegroup[];

  roleGroup!: Rolegroup;

  selectedRoleGroups!: Rolegroup[];

  rolesListBox!: ObjectListBox<string>[];

  selectedRoles: string[] = [];

  submitted!: boolean;

  roles!: Role[];

  role!: Role;

  label!: string[];

  form!: FormGroup;

  ref!: DynamicDialogRef;

  row!: number;

  totalRecords!: number;

  rowsPerPageOptions!: TablePagingFunction[];

  loading = false;

  constructor(
    private _roleService: RoleService,
    private _roleGroupService: RolegroupService,
    private confirmationService: ConfirmationService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder,
    private _helperService: HelperService,
    public config: DynamicDialogConfig
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
    });

    this.fetchAllData();
  }

  private fetchRoles(rg?: Rolegroup): void {
    this._roleService.findAllNotPaging().subscribe((data: Role[]) => {
      this.rolesListBox = this.transformRolesToGroups(data);
      if (rg) {
        this.selectedRoles = (rg.roles as Role[]).map(
          (r: Role) => r.id as string
        );
      }
    });
  }

  private transformRolesToGroups(roles: Role[]): Array<ObjectListBox<string>> {
    const rolesTransform = [...roles]
      .map((r) => {
        const item: ObjectListBox<string> = {
          label: r.name as string,
          value: r.id as string,
        };
        return item;
      })
      .sort();

    const roleGroupsLabel = new Set<string>();
    rolesTransform.forEach((r) =>
      roleGroupsLabel.add((r.label as string).split('_')[1])
    );
    const list = Array.from(roleGroupsLabel.values());

    const results: Array<ObjectListBox<string>> = [];
    list.forEach((label: string) => {
      const items = rolesTransform.filter((item) =>
        item.label?.startsWith(`ROLE_${label}_`)
      );
      results.push({ label, value: '', items });
    });

    return results;
  }

  onChange(value: any): void {
    this.selectedRoleGroups = value;
  }

  get f() {
    return this.form.controls;
  }

  private fetchAllData(): void {
    this.loading = true;
    this._roleGroupService
      .findAll()
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<Rolegroup>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe(
        (data) => {
          this.roleGroups = data;
          this.loading = false;
        },
        () => (this.loading = false)
      );
  }

  openNew(): void {
    this.fetchRoles();
    this.roleGroup = {};
    this.submitted = false;
    this.roleGroupDialog = true;
    this.isEditing = false;
  }

  deleteSelectedRoleGroups(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa các Quyền này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers(),
    });
  }

  private handlerDeleteMultiUsers(): void {
    this.roleGroups = this.roleGroups.filter(
      (val) => !this.selectedRoleGroups.includes(val)
    );

    const ids = [...this.selectedRoleGroups].map(
      (rgs: Rolegroup) => rgs.id as string
    );

    this.selectedRoleGroups = [];

    this._roleGroupService
      .deleteByIds(ids)
      .pipe(map(Mapping.toResponeDeletedByIds))
      .subscribe((data) => {
        if (data.successes.length) {
          this._notifyService.showSuccess(
            `Đã xóa các Quyền: ${data.successes.join(', ')} thành công!`
          );
        }
        if (data.errors.length) {
          this._notifyService.showError(
            `Không thể xóa các Quyền: ${data.successes.join(', ')}!`
          );
        }
      });
  }

  editRoleGroup(rg: Rolegroup): void {
    this.fetchRoles(rg);
    this.roleGroup = { ...rg };
    this.roleGroupDialog = true;
    this.isEditing = true;
  }

  deleteRoleGroup(rgs: Rolegroup): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa <b>' + rgs.name + '</b> ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(rgs),
    });
  }

  onSelected(rgs: Rolegroup[]): void {
    this.selectedRoleGroups = rgs;
  }

  private handlerDelete(rgs: Rolegroup): void {
    this._roleGroupService
      .deleteById(rgs.id)
      .pipe(
        take(1),
        tap((_) => this._notifyService.showSuccess('Xóa Lớp thành công')),
        switchMap((_) => this._roleGroupService.findAll()),
        switchMap((obj: ObjectResponsePaging<MathDesign>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data: MathDesign[]) => {
        this.roleGroups = data;
      });
  }

  hideDialog(): void {
    this.roleGroupDialog = false;
    this.submitted = false;
  }

  private validateBefireSaveOrUpdate(): boolean {
    //confirm submit
    this.submitted = true;

    // validate data
    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return false;
    }

    // reset flag check existed classname
    this.isExistedName = false;

    return true;
  }

  saveRoleGroup(): void {
    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    this.roleGroup.roles = [...this.selectedRoles];

    // save the block
    this._roleGroupService
      .save(this.roleGroup)
      .pipe(
        take(1),
        tap((m: Rolegroup) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Tạo ${m.name} thành công`);
        }),
        switchMap((_) => this._roleGroupService.findAll()),
        switchMap((obj: ObjectResponsePaging<Rolegroup>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe(
        (data: Rolegroup[]) => {
          this.roleGroups = data;
          this.selectedRoles = [];
        },
        (err) => {
          this.isExistedName = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      );
  }

  updateRoleGroup(): void {
    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // reset flag check existed Blockname
    this.isExistedName = false;

    const data = { ...this.roleGroup };
    data.roles = this.selectedRoles as string[];

    // save the block
    this._roleGroupService
      .update(data)
      .pipe(
        take(1),
        tap((m: Rolegroup) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Cập nhật ${m.name} thành công`);
        }),
        switchMap((_) => this._roleGroupService.findAll()),
        switchMap((obj: ObjectResponsePaging<Rolegroup>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe(
        (data: Rolegroup[]) => {
          this.roleGroups = data;
        },
        (err) => {
          this.isExistedName = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      );
  }

  onPagingChange(paging: Paging): void {
    this._roleGroupService
      .findAll(paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<Rolegroup>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap((_) => console.log(this.rows, this.totalRecords))
      )
      .subscribe((data) => {
        this.roleGroups = data;
      });
  }
}

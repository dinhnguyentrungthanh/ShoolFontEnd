import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';

import { map, switchMap, take, tap, concatMap } from 'rxjs/operators';
import { Class } from 'src/app/@core/model/base.class';
import { User } from 'src/app/@core/model/user.model';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { ClassService } from 'src/app/@core/service/class.service';
import { Block } from 'src/app/@core/model/block.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent extends PagingFunction implements OnInit {

  isExistedClassname = false;

  isEditing = false;

  classDialog!: boolean;

  classes!: Class[];

  class!: Class;

  selectedClasses!: Class[];

  submitted!: boolean;

  form!: FormGroup;

  blocks!: Block[];

  block!: Block;

  loading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private _classService: ClassService,
    private _helperService: HelperService,
    private _blockervice: BlockService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder
  ) { super(); }

  ngOnInit(): void {
    this.fetchAllData();
    this.form = this._fb.group({
      classname: ['', [Validators.required]],
    });
  }

  private fetchBlocks(c?: Class): void {
    this._blockervice.findAllNotPaging().subscribe(data => {
      this.blocks = data;
      if (c && c.block) {
        this.block = this.blocks.find((block: Block) => block.id === ((c.block as Block).id)) as Block;
      }
    });
  }

  get f() { return this.form.controls; }

  private fetchAllData(): void {
    this.loading = true;
    this._classService.findAll().pipe(
      take(1),
      switchMap((obj: ObjectResponsePaging<Class>) => this._helperService.bindingPaging(obj, this)),
      switchMap((classes: Class[]) => this._helperService.queryBlocksFromMajors(classes)),
    ).subscribe(data => {
      this.classes = data;
      this.loading = false;
    }, _ => this.loading = false);
  }

  openNew(): void {
    this.fetchBlocks();

    this.class = {};
    this.submitted = false;
    this.classDialog = true;
    this.isEditing = false;
  }

  deleteSelectedClasses(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn các xóa Lớp này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers()
    });
  }

  private handlerDeleteMultiUsers(): void {
    this.classes = this.classes.filter(val => !this.selectedClasses.includes(val));

    const ids = [...this.selectedClasses].map((c: Class) => c.id as string);

    this.selectedClasses = [];

    this._classService.deleteByIds(ids)
      .pipe(
        map(Mapping.toResponeDeletedByIds)
      )
      .subscribe(data => {
        if (data.successes.length) {
          this._notifyService.showSuccess(`Đã xóa các Lớp: ${data.successes.join(', ')} thành công!`);
        }
        if (data.errors.length) {
          this._notifyService.showError(`Không thể xóa các Lớp: ${data.successes.join(', ')}!`);
        }
      });
  }

  editClass(c: Class): void {
    this.fetchBlocks(c);

    this.class = { ...c };
    this.classDialog = true;
    this.isEditing = true;
  }

  deleteClass(c: Class): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa ' + c.classname + ' ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(c)
    });
  }

  onSelected(classes: Class[]): void {
    this.selectedClasses = classes;
  }

  private handlerDelete(c: Class): void {
    this._classService.deleteById(c.id)
      .pipe(
        take(1),
        tap(_ => this._notifyService.showSuccess('Xóa Lớp thành công')),
        switchMap(_ => this._classService.findAll()),
        switchMap((obj: ObjectResponsePaging<Class>) => this._helperService.bindingPaging(obj, this)),
        switchMap((classes: Class[]) => this._helperService.queryBlocksFromMajors(classes)),
      )
      .subscribe((data: Class[]) => {
        this.classes = data;
      });

  }

  hideDialog(): void {
    this.classDialog = false;
    this.submitted = false;
  }

  private validateBefireSaveOrUpdate(): boolean {
    //confirm submit
    this.submitted = true;

    // validate data
    if (this.form.invalid || !this.block) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return false;
    }

    // reset flag check existed classname
    this.isExistedClassname = false;

    return true;
  }

  saveClass(): void {

    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    this.class.block = this.block.id;

    // save the block
    this._classService.save(this.class)
      .pipe(
        take(1),
        tap((c: Class) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Tạo ${c.classname} thành công`);
        }),
        switchMap(_ => this._classService.findAll()),
        switchMap((obj: ObjectResponsePaging<Class>) => this._helperService.bindingPaging(obj, this)),
        switchMap((classes: Class[]) => this._helperService.queryBlocksFromMajors(classes)),
      )
      .subscribe((data: Class[]) => {
        this.classes = data;
      }, err => {
        this.isExistedClassname = true;
        this._notifyService.showError(`${err.error.message}`);
      });
  }

  updateClass(): void {

    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // reset flag check existed Blockname
    this.isExistedClassname = false;

    const data = { ...this.class };
    // const users = [...this.class.users as User[]];
    // const userids = users.map((u: User) => u.id) as string[];
    data.block = this.block.id as string;
    // data.users = userids && userids.length ? userids : [];

    // save the block
    this._classService.update(data)
      .pipe(
        take(1),
        tap((c: Class) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Cập nhật ${c.classname} thành công`);
        }),
        switchMap(_ => this._classService.findAll()),
        switchMap((obj: ObjectResponsePaging<Class>) => this._helperService.bindingPaging(obj, this)),
        switchMap((classes: Class[]) => this._helperService.queryBlocksFromMajors(classes)),
      )
      .subscribe((data: Class[]) => {
        this.classes = data;
      }, err => {
        this.isExistedClassname = true;
        this._notifyService.showError(`${err.error.message}`);
      });
  }

  onPagingChange(paging: Paging): void {
    this._classService.findAll(paging).pipe(
      switchMap((obj: ObjectResponsePaging<Class>) => this._helperService.bindingPaging(obj, this)),
      switchMap((classes: Class[]) => this._helperService.queryBlocksFromMajors(classes))
    ).subscribe(data => {
      this.classes = data;
    });
  }

}

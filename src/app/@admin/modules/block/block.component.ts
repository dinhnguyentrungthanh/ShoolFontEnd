import { Class } from 'src/app/@core/model/base.class';
import { Block } from './../../../@core/model/block.model';
import { PagingFunction } from './../../../@core/utils/PagingFunction';
import { HelperService } from './../../../@core/service/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';

import { map, switchMap, take, tap } from 'rxjs/operators';

import { BlockService } from 'src/app/@core/service/block.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { Major } from 'src/app/@core/model/major.model';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent extends PagingFunction implements OnInit {

  isExistedBlockname = false;

  isEditing = false;

  blockDialog!: boolean;

  blocks!: Block[];

  block!: Block;

  selectedBlocks!: Block[];

  submitted!: boolean;

  form!: FormGroup;

  loading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private _blockService: BlockService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder,
    private _helperService: HelperService
  ) { super(); }

  ngOnInit(): void {
    this.fetchAllData();
    this.form = this._fb.group({
      blockname: ['', [Validators.required]],
    });
  }

  get f(): any { return this.form.controls; }

  private fetchAllData(): void {
    this.loading = true;
    this._blockService.findAll()
    .pipe(
      take(1),
      switchMap((obj: ObjectResponsePaging<Block>) => this._helperService.bindingPaging(obj, this))
    )
    .subscribe(data => {
      this.blocks = data;this.loading = false;
    }, _ => this.loading = false);
  }

  openNew(): void {
    this.block = {};
    this.submitted = false;
    this.blockDialog = true;
    this.isEditing = false;
    this.isExistedBlockname = false;
  }

  deleteSelectedBlocks(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn các xóa Khối này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers()
    });
  }

  private handlerDeleteMultiUsers(): void {

    const ids = [...this.selectedBlocks].map((b: Block) => b.id as string);

    this.selectedBlocks = [];

    this._blockService.deleteByIds(ids)
      .pipe(
        take(1),
        map(Mapping.toResponeDeletedByIds)
      )
      .subscribe(data => {
        if (data.successes.length) {
          this._notifyService.showSuccess(`Đã xóa các Khối: ${data.successes.join(', ')} thành công!`);

          this.blocks = this.blocks.filter(val => !this.selectedBlocks.includes(val));
        }
        if (data.errors.length) {
          this._notifyService.showError(`Không thể xóa các Khối: ${data.successes.join(', ')}!`);
        }
      });
  }

  editBlock(block: Block): void {
    this.block = { ...block };
    this.blockDialog = true;
    this.isEditing = true;
    this.isExistedBlockname = false;
  }

  deleteBlock(block: Block): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa ' + block.blockname + '?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(block)
    });
  }

  private handlerDelete(block: Block): void {
    this._blockService.deleteById(block.id)
      .pipe(
        take(1),
        tap(_ => this._notifyService.showSuccess('Xóa Khối thành công')),
        switchMap(_ => this._blockService.findAll()),
        switchMap((obj: ObjectResponsePaging<Block>) => this._helperService.bindingPaging(obj, this))
      )
      .subscribe((data: Block[]) => {
        this.blocks = data;
      });

  }

  hideDialog(): void {
    this.blockDialog = false;
    this.submitted = false;
  }

  onSelected(bls: Block[]): void {
    this.selectedBlocks = bls;
  }

  private validateBefireSaveOrUpdate(): boolean {
    //confirm submit
    this.submitted = true;

    // validate data
    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return false;
    }

    // reset flag check existed Blockname
    this.isExistedBlockname = false;

    return true;
  }

  saveBlock(): void {

    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // save the block
    this._blockService.save(this.block)
      .pipe(
        take(1),
        tap((b: Block) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Tạo ${b.blockname} thành công`);
        }),
        switchMap(_ => this._blockService.findAll()),
        switchMap((obj: ObjectResponsePaging<Block>) => this._helperService.bindingPaging(obj, this))
      )
      .subscribe((data: Block[]) => {
        this.blocks = data;
      }, err => {
        this.isExistedBlockname = true;
        this._notifyService.showError(`${err.error.message}`);
      });
  }

  updateBlock(): void {

    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // reset flag check existed Blockname
    this.isExistedBlockname = false;

    const data = { ...this.block };
    const majors = [...this.block.majors as Major[]];
    const majorIds = majors.map((m: Major) => m.id) as string[];
    data.majors = majorIds && majorIds.length ? majorIds : [];

    const classes = [...this.block.classes as Class[]];
    const classIds = classes.map((m: Class) => m.id) as string[];
    data.classes = classIds && classIds.length ? classIds : [];

    // save the block
    this._blockService.update(data)
      .pipe(
        take(1),
        tap((b: Block) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Cập nhật ${b.blockname} thành công`);
        }),
        switchMap(_ => this._blockService.findAll()),
        switchMap((obj: ObjectResponsePaging<Block>) => this._helperService.bindingPaging(obj, this))
      )
      .subscribe((data: Block[]) => {
        this.blocks = data;
      }, err => {
        this.isExistedBlockname = true;
        this._notifyService.showError(`${err.error.message}`);
      });
  }

  onPagingChange(paging: Paging): void {
    this._blockService.findAll(paging).pipe(
      switchMap((obj: ObjectResponsePaging<Block>) => this._helperService.bindingPaging(obj, this))
    ).subscribe(data => {
      this.blocks = data;
    });
  }

}


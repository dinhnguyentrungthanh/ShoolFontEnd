import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Block } from 'src/app/@core/model/block.model';
import { Major } from 'src/app/@core/model/major.model';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { MajorService } from 'src/app/@core/service/major.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';
import { TableMathdesignComponent } from '../mathdesign/table-mathdesign/table-mathdesign.component';

@Component({
  selector: 'app-major',
  templateUrl: './major.component.html',
  styleUrls: ['./major.component.scss']
})
export class MajorComponent extends PagingFunction implements OnInit {

  isExistedMajorname = false;

  isEditing = false;

  majorDialog!: boolean;

  majors!: Major[];

  major!: Major;

  selectedMajors!: Major[];

  submitted!: boolean;

  form!: FormGroup;

  blocks!: Block[];

  block!: Block;

  ref!: DynamicDialogRef;

  loading = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _majorService: MajorService,
    private _blockService: BlockService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder,
    private _helperService: HelperService,
    private _mathDesignService: MathdesignService,
    private _dialogService: DialogService

  ) { super(); }

  ngOnInit(): void {
    this.fetchAllData();
    this.form = this._fb.group({
      majorname: ['', [Validators.required]],
    });
  }

  private fetchBlocks(m?: Major): void {
    this._blockService.findAllNotPaging().subscribe(data => {
      this.blocks = data;
      if (m && m.block){
        this.block = this.blocks.find(block => block.id === ((m.block as Block).id)) as Block;
      }
    });

  }

  get f() { return this.form.controls; }

  private fetchAllData(): void {
    this.loading = true;
    this._majorService.findAll().pipe(
      take(1),
      switchMap((obj: ObjectResponsePaging<Major>) => this._helperService.bindingPaging(obj, this)),
      switchMap((majors: Major[]) => this._helperService.queryBlocksFromMajors(majors)),
    ).subscribe(data => {
      this.majors = data;this.loading = false;
    }, _ => this.loading = false);
  }

  openNew(): void {
    this.fetchBlocks();
    this.major = {};
    this.submitted = false;
    this.majorDialog = true;
    this.isEditing = false;
  }

  deleteSelectedMajors(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn các xóa Môn này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers()
    });
  }

  private handlerDeleteMultiUsers(): void {
    this.majors = this.majors.filter(val => !this.selectedMajors.includes(val));

    const ids = [...this.selectedMajors].map((m: Major) => m.id as string);

    this.selectedMajors = [];

    this._majorService.deleteByIds(ids)
      .pipe(
        map(Mapping.toResponeDeletedByIds)
      )
      .subscribe(data => {
        if (data.successes.length) {
          this._notifyService.showSuccess(`Đã xóa các Môn: ${data.successes.join(', ')} thành công!`);
        }
        if (data.errors.length) {
          this._notifyService.showError(`Không thể xóa các Môn: ${data.successes.join(', ')}!`);
        }
      });
  }

  editMajor(m: Major): void {
    this.fetchBlocks(m);
    this.major = { ...m };
    this.majorDialog = true;
    this.isEditing = true;
  }

  deleteMajor(m: Major): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa <b>' + m.majorname + '</b> ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(m)
    });
  }

  onSelected(m: Major[]) {
    this.selectedMajors = m;
  }

  private handlerDelete(majors: Major): void {
    this._majorService.deleteById(majors.id)
      .pipe(
        take(1),
        tap(_ => this._notifyService.showSuccess('Xóa Lớp thành công')),
        switchMap(_ => this._majorService.findAll()),
        switchMap((obj: ObjectResponsePaging<Major>) => this._helperService.bindingPaging(obj, this)),
        switchMap((majors: Major[]) => this._helperService.queryBlocksFromMajors(majors)),
      )
      .subscribe((data: Major[]) => {
        this.majors = data;
      });

  }

  hideDialog(): void {
    this.majorDialog = false;
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
    this.isExistedMajorname = false;

    return true;
  }

  saveClass(): void {

    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    this.major.block = this.block.id;

    // save the block
    this._majorService.save(this.major)
      .pipe(
        take(1),
        tap((m: Major) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Tạo ${m.majorname} thành công`);
        }),
        switchMap(_ => this._majorService.findAll()),
        switchMap((obj: ObjectResponsePaging<Major>) => this._helperService.bindingPaging(obj, this)),
        switchMap((majors: Major[]) => this._helperService.queryBlocksFromMajors(majors)),
      )
      .subscribe((data: Major[]) => {
        this.majors = data;
      }, err => {
        this.isExistedMajorname = true;
        this._notifyService.showError(`${err.error.message}`);
      });
  }

  updateClass(): void {

    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // reset flag check existed Blockname
    this.isExistedMajorname = false;

    const data = { ...this.major };
    const mathsDesign = [...this.major.mathDesigns as MathDesign[]];
    const mathdesignids = mathsDesign.map((m: MathDesign) => m.id) as string[];
    data.block = this.block.id as string;
    data.mathDesigns = mathdesignids && mathdesignids.length ? mathdesignids : [];

    // save the block
    this._majorService.update(data)
      .pipe(
        take(1),
        tap((m: Major) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Cập nhật ${m.majorname} thành công`);
        }),
        switchMap(_ => this._majorService.findAll()),
        switchMap((obj: ObjectResponsePaging<Major>) => this._helperService.bindingPaging(obj, this)),
        switchMap((majors: Major[]) => this._helperService.queryBlocksFromMajors(majors)),
      )
      .subscribe((data: Major[]) => {
        this.majors = data;
      }, err => {
        this.isExistedMajorname = true;
        this._notifyService.showError(`${err.error.message}`);
      });
  }

  onShowMathDesign(m: Major): void {
    console.log(m);
    this._fetchDataBeforeOpenDialog(m)
      .subscribe((mds: MathDesign[]) => this._showDialog(mds));

  }


  private _fetchDataBeforeOpenDialog(m: Major): Observable<MathDesign[]> {
    return this._majorService.findById(m.id as string)
      .pipe(
        switchMap((mj: Major) => forkJoin((mj.mathDesigns as string[]).map(mdId => this._mathDesignService.findById(mdId))))
      );
  }

  private _showDialog(mds: MathDesign[]): void {
    this.ref = this._dialogService.open(TableMathdesignComponent, {
      data: {
        mathdesigns: mds
      },
      header: 'Danh sách Dạng toán',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

  }

  onPagingChange(paging: Paging): void {
    console.log('paging', paging);
    this._majorService.findAll(paging).pipe(
      switchMap((obj: ObjectResponsePaging<Major>) => this._helperService.bindingPaging(obj, this)),
      switchMap((majors: Major[]) => this._helperService.queryBlocksFromMajors(majors)),
      tap(_ => console.log(this.rows, this.totalRecords))
    ).subscribe(data => {
      this.majors = data;
    });
  }
}

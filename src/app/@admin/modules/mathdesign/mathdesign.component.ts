/* eslint-disable no-shadow */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Chapter } from 'src/app/@core/model/base.chapter';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Major } from 'src/app/@core/model/major.model';
import { ChapterService } from 'src/app/@core/service/chapter.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { MajorService } from 'src/app/@core/service/major.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { forkJoin, Observable } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableChapterComponent } from '../chapter/table-chapter/table-chapter.component';
import { TableClassComponent } from '../class/table-class/table-class.component';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-mathdesign',
  templateUrl: './mathdesign.component.html',
  styleUrls: ['./mathdesign.component.scss'],
})
export class MathdesignComponent extends PagingFunction implements OnInit {
  isExistedmathDesignName = false;

  isEditing = false;

  mathdesignDialog!: boolean;

  mathdesigns!: MathDesign[];

  mathdesign!: MathDesign;

  selectedMathdesigns!: MathDesign[];

  submitted!: boolean;

  majors!: Major[];

  major!: Major;

  form!: FormGroup;

  ref!: DynamicDialogRef;

  loading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private _mathdesignService: MathdesignService,
    private _notifyService: NotifyService,
    private _majorService: MajorService,
    private _fb: FormBuilder,
    private _helperService: HelperService,
    private _chapterService: ChapterService,
    private _dialogService: DialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      mathDesignName: ['', [Validators.required]],
    });

    this.fetchAllData();
  }

  private fetchMajors(m?: MathDesign): void {
    this._majorService.findAllNotPaging().subscribe((data) => {
      this.majors = data;
      if (m) {
        this.major = this.majors.find(
          (major) => major.id === (m.major as Major).id
        ) as Major;
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  private fetchAllData(): void {
    this.loading = true;
    this._mathdesignService
      .findAll()
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<MathDesign>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((mds: MathDesign[]) =>
          this._helperService.queryMajorsFromMathDesigns(mds)
        )
      )
      .subscribe(
        (data) => {
          this.mathdesigns = data;
          this.loading = false;
        },
        (_) => (this.loading = false)
      );
  }

  openNew(): void {
    this.fetchMajors();
    this.mathdesign = {};
    this.submitted = false;
    this.mathdesignDialog = true;
    this.isEditing = false;
  }

  deleteSelectedMathDesigns(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa các Dạng toán này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers(),
    });
  }

  private handlerDeleteMultiUsers(): void {
    this.mathdesigns = this.mathdesigns.filter(
      (val) => !this.selectedMathdesigns.includes(val)
    );

    const ids = [...this.selectedMathdesigns].map(
      (m: MathDesign) => m.id as string
    );

    this.selectedMathdesigns = [];

    this._mathdesignService
      .deleteByIds(ids)
      .pipe(map(Mapping.toResponeDeletedByIds))
      .subscribe((data) => {
        if (data.successes.length) {
          this._notifyService.showSuccess(
            `Đã xóa các Dạng Toán: ${data.successes.join(', ')} thành công!`
          );
        }
        if (data.errors.length) {
          this._notifyService.showError(
            `Không thể xóa các Dạng Toán: ${data.successes.join(', ')}!`
          );
        }
      });
  }

  editMathDesign(m: MathDesign): void {
    this.fetchMajors(m);
    this.mathdesign = { ...m };
    this.mathdesignDialog = true;
    this.isEditing = true;
  }

  deleteMathDesign(m: MathDesign): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa <b>' + m.mathDesignName + '</b> ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(m),
    });
  }
  onSelected(mds: MathDesign[]): void {
    this.selectedMathdesigns = mds;
  }

  private handlerDelete(mathDesigns: MathDesign): void {
    this._mathdesignService
      .deleteById(mathDesigns.id)
      .pipe(
        take(1),
        tap((_) => this._notifyService.showSuccess('Xóa Lớp thành công')),
        switchMap((_) => this._mathdesignService.findAll()),
        switchMap((obj: ObjectResponsePaging<MathDesign>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((mds: MathDesign[]) =>
          this._helperService.queryMajorsFromMathDesigns(mds)
        )
      )
      .subscribe((data: MathDesign[]) => {
        this.mathdesigns = data;
      });
  }

  hideDialog(): void {
    this.mathdesignDialog = false;
    this.submitted = false;
  }

  private validateBefireSaveOrUpdate(): boolean {
    // confirm submit
    this.submitted = true;

    // validate data
    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return false;
    }

    // reset flag check existed classname
    this.isExistedmathDesignName = false;

    return true;
  }

  saveMathDesign(): void {
    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    this.mathdesign.major = this.major.id;

    // save the block
    this._mathdesignService
      .save(this.mathdesign)
      .pipe(
        take(1),
        tap((m: MathDesign) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Tạo ${m.mathDesignName} thành công`);
        }),
        switchMap((_) => this._mathdesignService.findAll()),
        switchMap((obj: ObjectResponsePaging<MathDesign>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((mds: MathDesign[]) =>
          this._helperService.queryMajorsFromMathDesigns(mds)
        )
      )
      .subscribe(
        (data: MathDesign[]) => {
          this.mathdesigns = data;
        },
        (err) => {
          this.isExistedmathDesignName = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      );
  }

  updateMathDesign(): void {
    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // reset flag check existed Blockname
    this.isExistedmathDesignName = false;

    const data = { ...this.mathdesign };
    const chapter = [...(this.mathdesign.chapters as Chapter[])];
    const chapterIds = chapter.map((c: Chapter) => c.id) as string[];
    data.major = this.major.id as Major;
    data.chapters = chapterIds && chapterIds.length ? chapterIds : [];

    // save the block
    this._mathdesignService
      .update(data)
      .pipe(
        take(1),
        tap((m: MathDesign) => {
          this.hideDialog();
          this._notifyService.showSuccess(
            `Cập nhật ${m.mathDesignName} thành công`
          );
        }),
        switchMap((_) => this._mathdesignService.findAll()),
        switchMap((obj: ObjectResponsePaging<MathDesign>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((mds: MathDesign[]) =>
          this._helperService.queryMajorsFromMathDesigns(mds)
        )
      )
      .subscribe(
        (data: MathDesign[]) => {
          this.mathdesigns = data;
        },
        (err) => {
          this.isExistedmathDesignName = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      );
  }

  onShowChapter(m: MathDesign): void {
    this._fetchDataBeforeOpenDialog(m).subscribe((c: Chapter[]) =>
      this._showDialog(c)
    );
  }

  private _fetchDataBeforeOpenDialog(m: MathDesign): Observable<Chapter[]> {
    console.log(111);
    return this._mathdesignService
      .findById(m.id as string)
      .pipe(
        switchMap((m: MathDesign) =>
          forkJoin(
            (m.chapters as string[]).map((mid) =>
              this._chapterService.findById(mid)
            )
          )
        )
      );
  }

  private _showDialog(c: Chapter[]): void {
    console.log(123);
    this.ref = this._dialogService.open(TableChapterComponent, {
      data: {
        chapters: c,
      },
      header: 'Danh sách chương ',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  onPagingChange(paging: Paging): void {
    this._mathdesignService
      .findAll(paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<MathDesign>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((mds: MathDesign[]) =>
          this._helperService.queryMajorsFromMathDesigns(mds)
        )
      )
      .subscribe((data) => {
        this.mathdesigns = data;
      });
  }
}

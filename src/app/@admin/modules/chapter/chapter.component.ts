import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Chapter } from 'src/app/@core/model/base.chapter';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Block } from 'src/app/@core/model/block.model';
import { Knowledge } from 'src/app/@core/model/knowledge.model';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { ChapterService } from 'src/app/@core/service/chapter.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent extends PagingFunction implements OnInit {
  isExistedchaptername = false;

  isEditing = false;

  chapterDialog!: boolean;

  chapters!: Chapter[];

  chapter!: Chapter;

  selectedChapter!: Chapter[];

  submitted!: boolean;

  ref!: DynamicDialogRef;

  form!: FormGroup;

  blocks!: Block[];

  block!: Block;

  mathDesigns!: MathDesign[];

  mathDesign!: MathDesign;

  loading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private _chapterService: ChapterService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder,
    private _helperService: HelperService,
    private _blockService: BlockService,
    private _mathDesignService: MathdesignService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchAllData();
    this.form = this._fb.group({
      chaptername: ['', [Validators.required]],
    });
  }

  private fetchBlocks(c?: Chapter): void {
    this._blockService.findAllNotPaging().subscribe((data) => {
      this.blocks = data;
      if (c) {
        this.block = this.blocks.find(
          (block) => block.id == (c.block as Block).id
        ) as Block;
      }
    });
  }

  private fetchMathDesigns(c?: Chapter): void {
    this._mathDesignService.findAllNotPaging().subscribe((data) => {
      this.mathDesigns = data;
      if (c) {
        this.mathDesign = this.mathDesigns.find(
          (md) => md.id == (c.mathDesign as MathDesign).id
        ) as MathDesign;
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  private fetchAllData(): void {
    this._chapterService
      .findAll()
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<Chapter>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryMathDesignFromChapters(chapter)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryBlockFromChapters(chapter)
        )
      )
      .subscribe(
        (data) => {
          this.chapters = data;
          this.loading = false;
        },
        (_) => (this.loading = false)
      );
  }

  openNew(): void {
    this.fetchBlocks();
    this.fetchMathDesigns();
    this.chapter = {};
    this.submitted = false;
    this.chapterDialog = true;
    this.isEditing = false;
  }

  deleteSelectedChapter(): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn các xóa Môn này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiUsers(),
    });
  }

  private handlerDeleteMultiUsers(): void {
    this.chapters = this.chapters.filter(
      (val) => !this.selectedChapter.includes(val)
    );

    const ids = [...this.selectedChapter].map((c: Chapter) => c.id as string);

    this.selectedChapter = [];

    this._chapterService
      .deleteByIds(ids)
      .pipe(map(Mapping.toResponeDeletedByIds))
      .subscribe((data) => {
        if (data.successes.length) {
          this._notifyService.showSuccess(
            `Đã xóa các Chương: ${data.successes.join(', ')} thành công!`
          );
        }
        if (data.errors.length) {
          this._notifyService.showError(
            `Không thể xóa các Chương: ${data.successes.join(', ')}!`
          );
        }
      });
  }

  editChapter(c: Chapter): void {
    this.fetchBlocks(c);
    this.fetchMathDesigns(c);
    this.chapter = { ...c };
    this.chapterDialog = true;
    this.isEditing = true;
  }

  deleteChapter(c: Chapter): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa <b>' + c.chaptername + '</b> ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(c),
    });
  }

  onSelected(c: Chapter[]): void {
    this.selectedChapter = c;
  }

  private handlerDelete(chapters: Chapter): void {
    this._chapterService
      .deleteById(chapters.id)
      .pipe(
        take(1),
        tap((_) => this._notifyService.showSuccess('Xóa Chương thành công')),
        switchMap((_) => this._chapterService.findAll()),
        switchMap((obj: ObjectResponsePaging<Chapter>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryMathDesignFromChapters(chapter)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryBlockFromChapters(chapter)
        )
      )
      .subscribe((data: Chapter[]) => {
        this.chapters = data;
      });
  }

  hideDialog(): void {
    this.chapterDialog = false;
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
    this.isExistedchaptername = false;

    return true;
  }

  saveChapter(): void {
    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    this.chapter.block = this.block.id;
    this.chapter.mathDesign = this.mathDesign.id;

    // save the block
    this._chapterService
      .save(this.chapter)
      .pipe(
        tap((c: Chapter) => {
          this.hideDialog();
          this._notifyService.showSuccess(`Tạo ${c.chaptername} thành công`);
        }),
        switchMap((_) => this._chapterService.findAll()),
        switchMap((obj: ObjectResponsePaging<Chapter>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryMathDesignFromChapters(chapter)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryBlockFromChapters(chapter)
        )
      )
      .subscribe(
        (data: Chapter[]) => {
          this.chapters = data;
          this.block = new Block();
          this.mathDesign = new MathDesign();
        },
        (err) => {
          this.isExistedchaptername = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      );
  }

  updateChapter(): void {
    if (!this.validateBefireSaveOrUpdate()) {
      return;
    }

    // reset flag check existed Blockname
    this.isExistedchaptername = false;

    const data = { ...this.chapter };
    const knowledges = [...(this.chapter.knowledges as Knowledge[])];
    const knowledgeids = knowledges.map((k: Knowledge) => k.id) as string[];
    data.block = this.block.id;
    data.mathDesign = this.mathDesign.id;
    data.knowledges = knowledgeids && knowledgeids.length ? knowledgeids : [];

    // save the block
    this._chapterService
      .update(data)
      .pipe(
        tap((c: Chapter) => {
          this.hideDialog();
          this._notifyService.showSuccess(
            `Cập nhật ${c.chaptername} thành công`
          );
        }),
        switchMap((_) => this._chapterService.findAll()),
        switchMap((obj: ObjectResponsePaging<Chapter>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryMathDesignFromChapters(chapter)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryBlockFromChapters(chapter)
        )
      )
      .subscribe(
        (data: Chapter[]) => {
          this.chapters = data;
        },
        (err) => {
          this.isExistedchaptername = true;
          this._notifyService.showError(`${err.error.message}`);
        }
      );
  }

  onPagingChange(paging: Paging): void {
    this._chapterService
      .findAll(paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<Chapter>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryMathDesignFromChapters(chapter)
        ),
        switchMap((chapter: Chapter[]) =>
          this._helperService.queryBlockFromChapters(chapter)
        )
      )
      .subscribe((data) => {
        this.chapters = data;
      });
  }
}

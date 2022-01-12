import { NotifyService } from './../../../@core/service/notify.service';
import { AdminConstraint } from 'src/app/@core/common/admin.constraint';
import { HelperService } from './../../../@core/service/helper.service';
import { SearchAndFilterService } from './../../../@core/service/search-and-filter.service';
import { ChapterService } from './../../../@core/service/chapter.service';
import { MathdesignService } from './../../../@core/service/mathdesign.service';
import { Knowledge } from './../../../@core/model/knowledge.model';
import { Chapter } from './../../../@core/model/base.chapter';
import { MathDesign } from './../../../@core/model/base.mathDesign';
import { BlockService } from './../../../@core/service/block.service';
import { Router } from '@angular/router';
import { KnowledgeService } from 'src/app/@core/service/knowledge.service';
import { Component, OnInit, NgModule, OnDestroy } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Block } from 'src/app/@core/model/block.model';
import { Subject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { Mapping } from 'src/app/@core/utils/mapping.util';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class KnowledgeComponent extends PagingFunction implements OnInit {

  isOpenDiaglog = false;

  isSubmitted = false;

  knowledges: any = [];

  knowledge: Knowledge = {};

  isSuccess = false;

  blocks: Block[] = [];

  mathDesigns: MathDesign[] = [];

  chapters: Chapter[] = [];

  message: any = [];

  selectedBlocks: Block[] = [];

  selectedMathDesigns: MathDesign[] = [];

  selectedChapters: Chapter[] = [];

  selectedKnowledges: Knowledge[] = [];

  keywords = '';

  isSearchingBtn = false;

  selectedBlock: any = {};

  loading = false;

  constructor(
    private _knowledgeService: KnowledgeService,
    private _router: Router,
    private _blockService: BlockService,
    private _mathDesignService: MathdesignService,
    private _chapterService: ChapterService,
    private _searchAndFilterService: SearchAndFilterService,
    private _helperService: HelperService,
    private _confirmationService: ConfirmationService,
    private _notifyService: NotifyService
  ) { super(); }

  ngOnInit(): void {
    this.loading = true;
    this.fetchBlocks();
    this.fetchChapters();
    this.fetchMathDesigns();

    this._fetchAllData();
  }

  private _fetchAllData(): void {
    this._knowledgeService.findAll()
    .pipe(
      take(1),
      switchMap((obj: ObjectResponsePaging<Knowledge>) => this._helperService.bindingPaging(obj, this))
    )
    .subscribe(data => {
      this.knowledges = data;
    }).add((_: any) => {
      this.loading = false;
    });
  }

  fetchBlocks(): void {
    this._blockService.findAllNotPaging().pipe(
      take(1)
    )
      .subscribe(data => {
        this.blocks = data;
      });
  }

  fetchMathDesigns(): void {
    this._mathDesignService.findAllNotPaging().pipe(
      take(1)
    )
      .subscribe(data => this.mathDesigns = data);
  }

  fetchChapters(): void {
    this._chapterService.findAllTemp().pipe(
      take(1)
    ).subscribe(data => this.chapters = data);
  }

  changeBlock(): void {
    if (this.selectedBlocks && this.selectedBlocks.length) {
      this.fetchMathDesignByBlocks(this.selectedBlocks);
      return;
    }
    this.fetchMathDesigns();
  }

  changeMathDesign(): void {
    if (this.selectedMathDesigns && this.selectedMathDesigns.length) {
      this.fetchChapterByMathDesigns(this.selectedMathDesigns);
      return;
    }
    this.fetchChapters();
  }

  onSearching(): void {
    const keywords = this.keywords;
    const blocks = [...this.selectedBlocks].map(b => b.id);
    const mathDesigns = [...this.selectedMathDesigns].map(md => md.id);
    const chapters = [...this.selectedChapters].map(c => c.id);
    if (keywords.trim()) {
      this.isSearchingBtn = true;
      this._searchAndFilterService.searchingKnowledge({
        keywords, blocks, mathDesigns, chapters
      }).subscribe(data => {
        this.knowledges = data;
        this.isSearchingBtn = false;
      });
    }
  }

  fetchMathDesignByBlocks(blocks: Block[]): void {
    if (blocks && blocks.length) {
      this._searchAndFilterService.fetchMathDesignFromBlocks(blocks).pipe(
        take(1)
      )
        .subscribe(this.reSetValueForMathDesignDropdown);
    }
  }

  fetchChapterByMathDesigns(mathDesigns: MathDesign[]): void {
    if (mathDesigns && mathDesigns.length) {
      this._searchAndFilterService.fetchChapterByMathDesigns(mathDesigns).pipe(
        take(1)
      )
        .subscribe(this.reSetValueForChapterDropdown);
    } else {
      this.chapters = [];
      this.selectedChapters = [];
    }
  }

  reSetValueForMathDesignDropdown = (mds: MathDesign[]) => {
    const selectedMathDesignIds = [...this.selectedMathDesigns].map(md => md.id);
    this.mathDesigns = mds;
    this.selectedMathDesigns = [...this.mathDesigns].filter(m => {
      const condition = selectedMathDesignIds.includes(m.id);
      return condition;
    });

    let mdsTemp = [...mds];
    if (this.selectedMathDesigns.length){
      mdsTemp = this.selectedMathDesigns;
    }

    this.fetchChapterByMathDesigns(mdsTemp);
  };

  reSetValueForChapterDropdown = (chapters: Chapter[]) => {
    const selectedChapterIds = [...this.selectedChapters].map(chapter => chapter.id);
    this.chapters = chapters;
    this.selectedChapters = [...this.chapters].filter(chapter => {
      const condition = selectedChapterIds.includes(chapter.id);
      return condition;
    });
  };

  initOrResetFilter(): void {
    this.fetchBlocks();
    this.fetchChapters();
    this.fetchMathDesigns();
    this._fetchAllData();

    this.selectedBlocks = [];
    this.selectedMathDesigns = [];
    this.selectedChapters = [];
    this.keywords = '';
  }

  onDelete(knowledge: Knowledge): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa Kiến thức này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(knowledge)
    });
  }

  private handlerDelete(knowledge: Knowledge): void {
    this._knowledgeService.deleteById(knowledge.id)
      .pipe(
        take(1),
        tap(_ => this._notifyService.showSuccess('Xóa Kiến thức thành công')),
        switchMap(_ => this._knowledgeService.findAll()),
        switchMap((obj: ObjectResponsePaging<Knowledge>) => this._helperService.bindingPaging(obj, this))
      )
      .subscribe((data: Knowledge[]) => {
        this.knowledges = data;
      });

  }

  onEdit(knowledge: Knowledge): void {
    this._router.navigateByUrl(`${AdminConstraint.KNOWLEDGE_EDIT}/${knowledge.id}`);
  }

  onSelected(knowledges: Knowledge[]): void {
    this.selectedKnowledges = knowledges;
  }

  onDeleteAllKnowledge(): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa các Kiến thức này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiKnowledge()
    });
  }

  private handlerDeleteMultiKnowledge(): void {
    this.knowledges = this.knowledges.filter((val: any) => !this.selectedKnowledges.includes(val));

    const ids = [...this.selectedKnowledges].map((b: Knowledge) => b.id as string);

    this._knowledgeService.deleteByIds(ids)
      .pipe(
        take(1),
        map(Mapping.toResponeDeletedByIds),
        tap(data => {
          if (data.successes.length) {
            this._notifyService.showSuccess(`Đã xóa các Kiến thức: ${data.successes.join(', ')} thành công!`);
          }
          if (data.errors.length) {
            this._notifyService.showError(`Không thể xóa các Kiến thức: ${data.successes.join(', ')}!`);
          }
        }),
        switchMap(_ => this._knowledgeService.findAll()),
        switchMap((obj: ObjectResponsePaging<Knowledge>) => this._helperService.bindingPaging(obj, this))
      )
      .subscribe(data => {
        this.knowledges = data;
      });
  }

  onPagingChange(paging: Paging): void {
    this._knowledgeService.findAll(paging).pipe(
      switchMap((obj: ObjectResponsePaging<Knowledge>) => this._helperService.bindingPaging(obj, this))
    ).subscribe(data => {
      this.knowledges = data;
    });
  }
}

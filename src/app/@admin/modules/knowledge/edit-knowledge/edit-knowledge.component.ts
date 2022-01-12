import { EditorUtils } from 'src/app/@core/utils/editor.util';
import { NotifyService } from './../../../../@core/service/notify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Block } from './../../../../@core/model/block.model';
import { MathDesign } from './../../../../@core/model/base.mathDesign';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';


import { SearchAndFilterService } from './../../../../@core/service/search-and-filter.service';
import { ChapterService } from 'src/app/@core/service/chapter.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { BlockService } from 'src/app/@core/service/block.service';
import { Chapter } from 'src/app/@core/model/base.chapter';
import { ChapterOfKnowledge, Knowledge } from './../../../../@core/model/knowledge.model';
import { Theory } from './../../../../@core/model/theory';
import { KnowledgeService } from 'src/app/@core/service/knowledge.service';
import * as ClassicEditor from 'src/assets/js/ck-editor-math-type/ckeditor.js';
import { toolBar } from 'src/app/@core/config/tool-bar-ckeditor.config';
import { concatMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-knowledge',
  templateUrl: './edit-knowledge.component.html',
  styleUrls: ['./edit-knowledge.component.scss'],
  providers: [MessageService]
})
export class EditKnowledgeComponent implements OnInit {

  public Editor = ClassicEditor;

  public toolBar = toolBar;

  knowledge: Knowledge = {};
  theory: Theory = {};
  knowledgeId = '';

  message: any = [];

  blocks: Block[] = [];
  mathDesigns: MathDesign[] = [];
  chapters: Chapter[] = [];

  selectedBlock: Block | undefined;
  selectedMathDesign: MathDesign | undefined;
  selectedChapter: Chapter | undefined;

  contents = '';

  form!: FormGroup;
  submitted = false;
  loadingSaveBtn = false;
  loadingDefaultBtn = false;

  constructor(
    private _knowledgeService: KnowledgeService,
    private _route: ActivatedRoute,
    private _blockService: BlockService,
    private _mathDesignService: MathdesignService,
    private _chapterService: ChapterService,
    private _searchAndFilterService: SearchAndFilterService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fetchBlocks();
    this.fetchMathDesigns();
    this.fetchChapters();
    this.fetchAllData();

    this.form = this._fb.group({
      knowledgeName: ['', [Validators.required]],
      contents: ['', [Validators.required]],
      block: ['', [Validators.required]],
      mathDesign: ['', [Validators.required]],
      chapter: ['', [Validators.required]]
    });
  }

  get f(): any { return this.form.controls; }

  fetchAllData(): void {
    this._route.params
      .pipe(
        take(1),
        tap(params => this.knowledgeId = params.id),
        concatMap(params => this._knowledgeService.findById(params.id))
      )
      .subscribe((k: Knowledge) => {
        this.bindData(k);
        this.bindDropdowns(k);
      });
  }

  bindData(k: Knowledge): void {
    this.knowledge = {...k};
    this.contents = k.contents as string;
    console.log(this.knowledge.contents);
  }

  bindDropdowns(k: Knowledge): void {
    this.selectedBlock = [...this.blocks].find(b => b.id === k.block) as Block;
    this.selectedMathDesign = [...this.mathDesigns].find(m => m.id === k.mathDesign) as MathDesign;
    this.selectedChapter = [...this.chapters].find(c => c.id === k.chapter) as Chapter;
  }

  fetchBlocks(): void {
    this._blockService.findAllNotPaging().subscribe(data => this.blocks = data);
  }

  fetchMathDesigns(): void {
    this._mathDesignService.findAllNotPaging().subscribe(data => {
      this.mathDesigns = data;
      this.selectedMathDesign = {};
    });
  }

  fetchChapters(): void {
    this._chapterService.findAllNotPaging().subscribe(data => this.chapters = data);
  }

  fetchMathDesignByBlock(block: Block): void {
    if (block) {
      this._searchAndFilterService.fetchMathDesignFromBlocks([block])
        .subscribe(this.reSetValueForMathDesignDropdown);
    }
  }

  fetchChapterByMathDesign(mathDesign: MathDesign): void {
    if (mathDesign) {
      this._searchAndFilterService.fetchChapterByMathDesigns([mathDesign])
        .subscribe(this.reSetValueForChapterDropdown);
    }
  }

  reSetValueForMathDesignDropdown = (mds: MathDesign[]) => {
    this.mathDesigns = mds;
    this.selectedMathDesign = undefined;
    this.selectedChapter = undefined;
    this.chapters = [];

    if (this.mathDesigns && this.mathDesigns.length) {
      this.selectedMathDesign = this.mathDesigns[0];
      this.fetchChapterByMathDesign(this.selectedMathDesign);
    }
  };


  reSetValueForChapterDropdown = (chapters: Chapter[]) => {
    this.chapters = chapters;
    this.selectedChapter = undefined;

    if (this.chapters && this.chapters.length) {
      this.selectedChapter = this.chapters[0];
    }
  };

  changeBlock(): void {
    if (this.selectedBlock) {
      this.fetchMathDesignByBlock(this.selectedBlock);
      return;
    }
    this.fetchMathDesigns();
  }

  changeMathDesign(): void {
    if (this.selectedMathDesign) {
      this.fetchChapterByMathDesign(this.selectedMathDesign);
      return;
    }
    this.fetchChapters();
  }

  saveKnowledge(): void {
    if (!this.validateKnowledgeBeforeSaveOrUpdate()) {
      return;
    }
    const ck = EditorUtils.getSelector();

    const data: ChapterOfKnowledge = {
      block: this.selectedBlock?.id,
      mathDesign: this.selectedMathDesign?.id,
      chapter: this.selectedChapter?.id,
      contents: EditorUtils.formatData(ck?.innerHTML as string),
      knowledgeName: this.knowledge.knowledgeName
    };


    this._knowledgeService.update(this.knowledgeId, data)
      .pipe(
        tap(_ => this.fetchAllData())
      )
      .subscribe(_ => {
        this._notifyService.showSuccess(`Cập nhật ${this.knowledgeId} thành công`);
      })
      .add((_: any) => {
        this.loadingSaveBtn = false;
      });
  }

  validateKnowledgeBeforeSaveOrUpdate(): boolean {

    //confirm submit
    this.submitted = true;
    this.loadingSaveBtn = true;

    const isInvalidDropdown = !this.selectedBlock || !this.selectedMathDesign
    || !this.selectedMathDesign || !this.f.contents.value.trim() || !this.f.knowledgeName.value.trim();

    // validate data
    if (isInvalidDropdown) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      this.loadingSaveBtn = false;
      return false;
    }

    return true;
  }

  onDefault(): void {
    this.loadingDefaultBtn = true;
    this.submitted = false;
    this.knowledge = {};

    this.form.reset();
    this.fetchBlocks();
    this.fetchMathDesigns();
    this.fetchChapters();
    this.fetchAllData();

    setTimeout(() => this.loadingDefaultBtn = false, 1000);
  }

}

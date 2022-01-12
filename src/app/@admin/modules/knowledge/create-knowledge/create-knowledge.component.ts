import { EditorUtils } from './../../../../@core/utils/editor.util';
import { StringUtils } from './../../../../@core/utils/string.util';
import { NotifyService } from './../../../../@core/service/notify.service';
import { ChapterService } from './../../../../@core/service/chapter.service';
import { ChapterOfKnowledge, Knowledge } from './../../../../@core/model/knowledge.model';
import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/@core/model/base.chapter';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Block } from 'src/app/@core/model/block.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnowledgeService } from 'src/app/@core/service/knowledge.service';
import { ActivatedRoute } from '@angular/router';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { SearchAndFilterService } from 'src/app/@core/service/search-and-filter.service';
import { BlockService } from 'src/app/@core/service/block.service';
import * as ClassicEditor from 'src/assets/js/ck-editor-math-type/ckeditor.js';
import { toolBar } from 'src/app/@core/config/tool-bar-ckeditor.config';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-knowledge',
  templateUrl: './create-knowledge.component.html',
  styleUrls: ['./create-knowledge.component.scss']
})
export class CreateKnowledgeComponent implements OnInit {

  public Editor = ClassicEditor;

  public toolBar = toolBar;

  knowledge: Knowledge = {};
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
  disableBtn = false;

  constructor(
    private _knowledgeService: KnowledgeService,
    private _blockService: BlockService,
    private _mathDesignService: MathdesignService,
    private _chapterService: ChapterService,
    private _searchAndFilterService: SearchAndFilterService,
    private _notifyService: NotifyService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.fetchBlocks();
    // this.fetchMathDesigns();
    // this.fetchChapters();

    this.form = this._fb.group({
      knowledgeName: ['', [Validators.required]],
      contents: ['', [Validators.required]],
      block: ['', [Validators.required]],
      mathDesign: ['', [Validators.required]],
      chapter: ['', [Validators.required]]
    });
  }

  get f(): any { return this.form.controls; }

  fetchBlocks(): void {
    this._blockService.findAllNotPaging().subscribe(data => {
      this.blocks = data;
      if(this.blocks.length === 1){
        this.selectedBlock = data[0];
        this.changeBlock();
      }
    });
  }

  fetchMathDesigns(): void {
    this._mathDesignService.findAllNotPaging().subscribe(data => {
      this.mathDesigns = data;
      this.selectedMathDesign = {};
    });
  }

  fetchChapters(): void {
    this._chapterService.findAllTemp().subscribe(data => this.chapters = data);
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


    this._knowledgeService.save(data)
      .subscribe(_ => {
        this._notifyService.showSuccess(`Tạo mới ${this.knowledgeId} thành công`);
      })
      .add((_: any) => {
        this.clearForm();
      });
  }

  validateKnowledgeBeforeSaveOrUpdate(): boolean {
    //confirm submit
    this.submitted = true;
    this.disableBtn = true;

    const isInvalidDropdown = !this.selectedBlock
      || !this.selectedMathDesign
      || !this.selectedMathDesign
      || !this.f.contents.value?.trim()
      || !this.f.knowledgeName.value?.trim();

    // validate data
    if (isInvalidDropdown) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      this.disableBtn = false;
      return false;
    }

    return true;
  }

  onClickBlock(): void {
    if (!this.blocks || this.blocks.length === 0) {
      this.fetchBlocks();
    }
  }

  clearForm(): void {
    this.disableBtn = false;
    this.submitted = false;
    this.blocks = [];
    this.mathDesigns = [];
    this.chapters = [];
    this.form.reset();
  }

}

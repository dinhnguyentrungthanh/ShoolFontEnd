import { ReviewQuestion } from './../../../@core/model/review-question';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { PagingFunction } from './../../../@core/utils/PagingFunction';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { ReviewQuestionService } from 'src/app/@core/service/review-question.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HelperService } from 'src/app/@core/service/helper.service';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { Mapping } from 'src/app/@core/utils/mapping.util';

import { toolBar } from 'src/app/@core/config/tool-bar-ckeditor.config';
import * as ClassicEditor from 'src/assets/js/ck-editor-math-type/ckeditor.js';
import { EditorUtils } from 'src/app/@core/utils/editor.util';

@Component({
  selector: 'app-review-question',
  templateUrl: './review-question.component.html',
  styleUrls: ['./review-question.component.scss'],
})
export class ReviewQuestionComponent extends PagingFunction implements OnInit {
  @Input() knowledgeId = '';

  isShowDialog = false;

  public Editor = ClassicEditor;

  public toolBar = toolBar;

  reviewQuestions: any = [];

  reviewQuestion: ReviewQuestion = {};

  form!: FormGroup;

  selectedReviewQuestions: ReviewQuestion[] = [];

  submitted = false;

  isEditing = false;

  loadingBtn = false;

  constructor(
    private _reviewQuestionService: ReviewQuestionService,
    private _confirmationService: ConfirmationService,
    private _notifyService: NotifyService,
    private _helperService: HelperService,
    private _fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this._fetchAllData();
    this.initForm();
  }

  private initForm(){
    this.form = this._fb.group({
      reviewQuestionName: ['', [Validators.required]],
      reviewQuestionAnswer: ['', [Validators.required]],
      time: [
        '',
        [Validators.required, Validators.min(1), Validators.max(3600)],
      ],
    });
  }

  get f(): any {
    return this.form.controls;
  }

  openCreateDialog(): void {
    this.submitted = false;
    this.reviewQuestion = {};
    this.isShowDialog = true;
    this.isEditing = false;
    this.form.reset();
  }

  openEditDialog(reviewQuetion: ReviewQuestion): void {
    this.submitted = false;
    this.reviewQuestion = reviewQuetion;
    this.isShowDialog = true;
    this.isEditing= true;
    this.form.reset();
  }

  private _fetchAllData(): void {
    this._reviewQuestionService
      .findAllByKnowledgeId(this.knowledgeId)
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<ReviewQuestion>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.reviewQuestions = data;
      });
  }

  onDelete(reviewQuestion: ReviewQuestion): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa Câu hỏi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(reviewQuestion),
    });
  }

  private handlerDelete(reviewQuestion: ReviewQuestion): void {
    this._reviewQuestionService
      .deleteById(reviewQuestion.id)
      .pipe(
        take(1),
        switchMap((_) => this._reviewQuestionService.findAllByKnowledgeId(this.knowledgeId)),
        switchMap((obj: ObjectResponsePaging<ReviewQuestion>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap((_) => this._notifyService.showSuccess('Xóa Câu hỏi thành công')),
      )
      .subscribe((data: ReviewQuestion[]) => {
        this.reviewQuestions = data;
      });
  }

  onSelected(reviewQuestions: ReviewQuestion[]): void {
    this.selectedReviewQuestions = reviewQuestions;
  }

  onDeleteAllReviewQuestion(): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa các Câu hỏi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiReviewQuestion(),
    });
  }

  private handlerDeleteMultiReviewQuestion(): void {
    this.reviewQuestions = this.reviewQuestions.filter(
      (val: any) => !this.selectedReviewQuestions.includes(val)
    );

    const ids = [...this.selectedReviewQuestions].map(
      (b: ReviewQuestion) => b.id as string
    );

    this._reviewQuestionService
      .deleteByIds(ids)
      .pipe(
        take(1),
        map(Mapping.toResponeDeletedByIds),
        tap((data) => {
          if (data.successes.length) {
            this._notifyService.showSuccess(
              `Đã xóa các Câu hỏi: ${data.successes.join(', ')} thành công!`
            );
          }
          if (data.errors.length) {
            this._notifyService.showError(
              `Không thể xóa các Câu hỏi: ${data.successes.join(', ')}!`
            );
          }
        }),
        switchMap((_) => this._reviewQuestionService.findAllByKnowledgeId(this.knowledgeId)),
        switchMap((obj: ObjectResponsePaging<ReviewQuestion>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.reviewQuestions = data;
        this.selectedReviewQuestions = [];
      });
  }

  onPagingChange(paging: Paging): void {
    this._reviewQuestionService
      .findAll(paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<ReviewQuestion>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.reviewQuestions = data;
      });
  }

  onRowSelectOrUnSelect(array: ReviewQuestion[]): void {
    this.selectedReviewQuestions = array;
  }

  save(): void {
    this.submitted = true;
    this.loadingBtn = true;

    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const ckName = EditorUtils.getSelector('#reviewQuestionName');
    this.reviewQuestion.reviewQuestionName = EditorUtils.formatData(
      ckName?.innerHTML as string
    );

    const ckAnswer = EditorUtils.getSelector('#reviewQuestionAnswer');
    this.reviewQuestion.reviewQuestionAnswer = EditorUtils.formatData(
      ckAnswer?.innerHTML as string
    );

    this.reviewQuestion.knowledge = this.knowledgeId;

    this._reviewQuestionService
      .save(this.reviewQuestion)
      .pipe(
        switchMap((_) => this._reviewQuestionService.findAllByKnowledgeId(this.knowledgeId)),
        switchMap((obj: ObjectResponsePaging<ReviewQuestion>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap(data => this._notifyService.showSuccess(`Tạo mới thành công!`))
      )
      .subscribe(data => {
        this.reviewQuestions = data;
        this.resetForm();
      }).add((_: any) => {
        this.loadingBtn = false;
      });
  };

  update(): void {
    this.submitted = true;
    this.loadingBtn = true;

    if (this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      this.loadingBtn = false;
      return;
    }

    const ckName = EditorUtils.getSelector('#reviewQuestionName');
    this.reviewQuestion.reviewQuestionName = EditorUtils.formatData(
      ckName?.innerHTML as string
    );

    const ckAnswer = EditorUtils.getSelector('#reviewQuestionAnswer');
    this.reviewQuestion.reviewQuestionAnswer = EditorUtils.formatData(
      ckAnswer?.innerHTML as string
    );

    this.reviewQuestion.knowledge = this.knowledgeId;

    this._reviewQuestionService
      .update(this.reviewQuestion)
      .pipe(
        switchMap((_) => this._reviewQuestionService.findAllByKnowledgeId(this.knowledgeId)),
        switchMap((obj: ObjectResponsePaging<ReviewQuestion>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap(_ => this._notifyService.showSuccess('Cập nhật thông tin thành công!'))
      )
      .subscribe(data => {
        this.reviewQuestions = data;
        this.resetForm();
      }).add((_: any) => {
        this.loadingBtn = false;
      });
  }

  resetForm(): void {
    if(!this.isEditing){
      this.reviewQuestion = {};
    }
    this.isShowDialog = false;
  }
}

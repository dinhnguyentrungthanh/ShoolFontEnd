import { ETestType } from 'src/app/@core/model/testType.model';
import { EditorUtils } from 'src/app/@core/utils/editor.util';
import {
  ObjectResponsePaging,
  Paging,
} from './../../../@core/model/paging.model';
import { Test } from '../../../@core/model/test.model';
import { TestService } from '../../../@core/service/test.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Block } from 'src/app/@core/model/block.model';
import { HelperService } from 'src/app/@core/service/helper.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { toolBar } from 'src/app/@core/config/tool-bar-ckeditor.config';
import * as ClassicEditor from 'src/assets/js/ck-editor-math-type/ckeditor.js';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';
import { ConfirmationService } from 'primeng/api';

export enum EAnswer {
  NONE='none',
  ANSWER1 = 'answer1',
  ANSWER2 = 'answer2',
  ANSWER3 = 'answer3',
  ANSWER4 = 'answer4',
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent extends PagingFunction implements OnInit {
  @Input() testTypeId!: string;
  @Input() eTestType: ETestType = ETestType.MULTI_CHOICE;

  public Editor = ClassicEditor;
  public toolBar = toolBar;

  tests: Test[] = [];
  selectedTests: Test[] = [];

  test!: Test;

  type = ETestType;

  form!: FormGroup;
  formEssay!: FormGroup;

  loading = false;
  submitted = false;
  disableBtn = false;
  isOpenDialog = false;
  isOpenDialogEssay = false;
  isEditing = false;

  loadingEditing = false;
  loadingCreating = false;

  selectedAnswer!: any | undefined;

  answers = [
    {
      label: 'Câu trả lời TN 1',
      value: EAnswer.ANSWER1,
    },
    {
      label: 'Câu trả lời TN 2',
      value: EAnswer.ANSWER2,
    },
    {
      label: 'Câu trả lời TN 3',
      value: EAnswer.ANSWER3,
    },
    {
      label: 'Câu trả lời TN 4',
      value: EAnswer.ANSWER4,
    },
  ];

  constructor(
    private _confirmationService: ConfirmationService,
    private _notifyService: NotifyService,
    private _helperService: HelperService,
    private _testService: TestService,
    private _fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this._fetchAllData();

    this.form = this._fb.group({
      question: ['', [Validators.required]],
      answer1: ['', [Validators.required]],
      answer2: ['', [Validators.required]],
      answer3: ['', [Validators.required]],
      answer4: ['', [Validators.required]],
    });

    this.formEssay = this._fb.group({
      question: ['', [Validators.required]],
      answerEssay: ['']
    });
  }

  get f(): any {
    return this.form.controls;
  }

  private _fetchAllData(): void {
    this._testService
      .findAllByTestTypeId(this.testTypeId)
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.tests = data;
      })
      .add((_: any) => {
        this.loading = false;
      });
  }

  onCreate(): void {
    this.test = {};
      this.submitted = false;
      this.isEditing = false;
      this.disableBtn = false;
      this.selectedAnswer = undefined;
      this.loadingCreating = true;

    if (this.eTestType === this.type.MULTI_CHOICE) {
      this.form.reset();

      setTimeout(() => {
        this.isOpenDialog = true;
        this.loadingCreating = false;
      }, 1000);
    } else {
      this.formEssay.reset();

      setTimeout(() => {
        this.isOpenDialogEssay = true;
        this.loadingCreating = false;
      }, 1000);
    }
  }

  openUpdateDialog(): void {
    this.isOpenDialog = true;
  }

  onPagingChange(paging: Paging): void {
    this._testService
      .findAllByTestTypeId(this.testTypeId, paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.tests = data;
      });
  }

  onDelete(test: Test): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa Câu hỏi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(test),
    });
  }

  private handlerDelete(test: Test): void {
    this._testService
      .deleteById(test.id)
      .pipe(
        take(1),
        tap((_) => this._notifyService.showSuccess('Xóa Câu hỏi thành công')),
        switchMap((_) =>
          this._testService.findAllByTestTypeId(this.testTypeId)
        ),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data: Test[]) => {
        this.tests = data;
      });
  }

  onEdit(test: Test): void {

    this.test = test;
    this.disableBtn = false;
    this.submitted = false;
    this.isEditing = true;
    this.loadingEditing = true;
    if (this.eTestType === this.type.MULTI_CHOICE) {
      this.selectedAnswer = [...this.answers].find(
        (e) => e.value === this.test.answerCorrect
      ) as any;
      this.bindingSelected(test);

      setTimeout(() => {
        this.isOpenDialog = true;
        this.loadingEditing = false;
      }, 1000);
    } else {

      setTimeout(() => {
        this.isOpenDialogEssay = true;
        this.loadingEditing = false;
      }, 1000);
    }
  }

  private bindingSelected(test: Test): void {}

  onSelected(test: Test[]): void {
    this.selectedTests = test;
  }

  onDeleteAllTests(): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa các Câu hỏi này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiTests(),
    });
  }

  private handlerDeleteMultiTests(): void {
    const ids = [...this.selectedTests].map((b: Test) => b.id as string);

    this._testService
      .deleteByIds(ids)
      .pipe(
        take(1),
        map(Mapping.toResponeDeletedByIds),
        tap((data) => {
          if (data.successes.length) {
            this.selectedTests = [];
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
        switchMap((_) =>
          this._testService.findAllByTestTypeId(this.testTypeId)
        ),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.tests = data;
      });
  }

  validateBeforeSaveOrUpdate(): boolean {
    //confirm submit
    this.submitted = true;
    this.disableBtn = true;

    const isInvalidDropdown = !this.selectedAnswer;

    // validate data
    if (isInvalidDropdown || this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      this.disableBtn = false;
      return false;
    }

    return true;
  }

  validateBeforeSaveOrUpdateForEssay(): boolean {
    //confirm submit
    this.submitted = true;
    this.disableBtn = true;

    // validate data
    if (this.formEssay.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      this.disableBtn = false;
      return false;
    }

    return true;
  }

  save(): void {
    if (!this.validateBeforeSaveOrUpdate()) {
      return;
    }

    this.bindingDataFromEditor();

    this.test.testType = this.testTypeId;

    this._testService
      .save(this.test)
      .pipe(
        switchMap((_) =>
          this._testService.findAllByTestTypeId(this.testTypeId)
        ),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap((data) => this._notifyService.showSuccess(`Tạo mới thành công!`))
      )
      .subscribe((data) => {
        this.tests = data;
        this.resetForm();
      })
      .add((_: any) => {
        this.disableBtn = false;
      });
  }

  saveEssay(): void {
    if (!this.validateBeforeSaveOrUpdateForEssay()) {
      return;
    }

    this.bindingDataFromEditorForEssay();

    this.test.testType = this.testTypeId;

    this._testService
      .save(this.test)
      .pipe(
        switchMap((_) =>
          this._testService.findAllByTestTypeId(this.testTypeId)
        ),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap((data) => this._notifyService.showSuccess(`Tạo mới thành công!`))
      )
      .subscribe((data) => {
        this.tests = data;
        this.resetFormEssay();
      })
      .add((_: any) => {
        this.disableBtn = false;
      });
  }

  update(): void {
    if (!this.validateBeforeSaveOrUpdate()) {
      return;
    }

    this.bindingDataFromEditor();

    this.test.testType = this.testTypeId;

    this._testService
      .update(this.test)
      .pipe(
        switchMap((_) =>
          this._testService.findAllByTestTypeId(this.testTypeId)
        ),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap((data) => this._notifyService.showSuccess(`Tạo mới thành công!`))
      )
      .subscribe((data) => {
        this.tests = data;
        this.resetForm();
      })
      .add((_: any) => {
        this.disableBtn = false;
      });
  }

  updateEssay(): void {
    if (!this.validateBeforeSaveOrUpdateForEssay()) {
      return;
    }

    this.bindingDataFromEditorForEssay();

    this.test.testType = this.testTypeId;

    this._testService
      .update(this.test)
      .pipe(
        switchMap((_) =>
          this._testService.findAllByTestTypeId(this.testTypeId)
        ),
        switchMap((obj: ObjectResponsePaging<Test>) =>
          this._helperService.bindingPaging(obj, this)
        ),
        tap((data) => this._notifyService.showSuccess(`Cập Nhật thành công!`))
      )
      .subscribe((data) => {
        this.tests = data;
        this.resetFormEssay();
      })
      .add((_: any) => {
        this.disableBtn = false;
      });
  }

  bindingDataFromEditor(): void {
    const ckQuestion = EditorUtils.getSelector('#question');
    this.test.question = EditorUtils.formatData(
      ckQuestion?.innerHTML as string
    );
    this.test.answerCorrect = this.selectedAnswer.value;
    const ckAnswer1 = EditorUtils.getSelector('#answer1');
    this.test.answer1 = EditorUtils.formatData(ckAnswer1?.innerHTML as string);
    const ckAnswer2 = EditorUtils.getSelector('#answer2');
    this.test.answer2 = EditorUtils.formatData(ckAnswer2?.innerHTML as string);
    const ckAnswer3 = EditorUtils.getSelector('#answer3');
    this.test.answer3 = EditorUtils.formatData(ckAnswer3?.innerHTML as string);
    const ckAnswer4 = EditorUtils.getSelector('#answer4');
    this.test.answer4 = EditorUtils.formatData(ckAnswer4?.innerHTML as string);

    this.test.answerEssay = `<p></p>`;
  }

  bindingDataFromEditorForEssay(): void {
    const ckQuestion = EditorUtils.getSelector('#question');
    this.test.question = EditorUtils.formatData(
      ckQuestion?.innerHTML as string
    );
    const ckaAnswerEssay = EditorUtils.getSelector('#answerEssay');
    this.test.answerEssay = EditorUtils.formatData(
      ckaAnswerEssay?.innerHTML as string
    );

    this.test.answerCorrect = EAnswer.NONE;
    this.test.answer1 = `<p></p>`;
    this.test.answer2 = `<p></p>`;
    this.test.answer3 = `<p></p>`;
    this.test.answer4 = `<p></p>`;
    this.test.answerEssay = `<p></p>`;
  }

  resetForm(): void {
    if (!this.isEditing) {
      this.test = {};
    }
    this.isOpenDialog = false;
  }

  resetFormEssay(): void {
    if (!this.isEditing) {
      this.test = {};
    }
    this.isOpenDialogEssay = false;
  }
}

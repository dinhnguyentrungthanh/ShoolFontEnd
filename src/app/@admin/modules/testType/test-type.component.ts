import { Paging } from './../../../@core/model/paging.model';
import { PagingFunction } from './../../../@core/utils/PagingFunction';
import { ETestType, TestType } from './../../../@core/model/testType.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Block } from 'src/app/@core/model/block.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { TestTypeService } from 'src/app/@core/service/testType.service';
import { ObjectResponsePaging } from 'src/app/@core/model/paging.model';

@Component({
  selector: 'app-test-type',
  templateUrl: './test-type.component.html',
  styleUrls: ['./test-type.component.scss'],
})
export class TestTypeComponent extends PagingFunction implements OnInit {
  testType: TestType = {};

  testTypes: TestType[] = [];

  selectedTestTypes: TestType[] = [];

  blocks: Block[] = [];

  selectedBlock!: Block | undefined;

  selectedType!: ETestType | undefined;

  isEditing = false;

  loading = false;

  types = [
    {
      name: 'Trắc Nghiệm',
      value: ETestType.MULTI_CHOICE,
    },
    {
      name: 'Tự Luận',
      value: ETestType.ESSAY,
    },
  ];

  isOpenDialog = false;

  submitted = false;

  form!: FormGroup;

  disableBtn = false;

  constructor(
    private _confirmationService: ConfirmationService,
    private _blockService: BlockService,
    private _notifyService: NotifyService,
    private _helperService: HelperService,
    private _testTypeService: TestTypeService,
    private _fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this._fetchAllData();
    this.fetchBlocks();

    this.form = this._fb.group({
      testTypeName: ['', [Validators.required]],
      block: ['', [Validators.required]],
      type: ['', [Validators.required]],
      time: [
        '',
        [Validators.required, Validators.min(1), Validators.max(7200)],
      ],
    });
  }

  get f(): any {
    return this.form.controls;
  }

  fetchBlocks(): void {
    this._blockService
      .findAllNotPaging()
      .pipe(take(1))
      .subscribe((data) => {
        this.blocks = data;
      });
  }

  private _fetchAllData(): void {
    this._testTypeService
      .findAll()
      .pipe(
        take(1),
        switchMap((obj: ObjectResponsePaging<TestType>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.testTypes = data;
      })
      .add((_: any) => {
        this.loading = false;
      });
  }

  save(): void {
    if (!this.validateBeforeSaveOrUpdate()) {
      return;
    }

    this.testType.type = this.selectedType;
    this.testType.block = this.selectedBlock?.id;

    this._testTypeService
      .save(this.testType)
      .pipe(
        take(1),
        tap((result) => {
          if(result){
            this.isOpenDialog = false;
            this._notifyService.showSuccess(`Tạo mới ${this.testType.testTypeName} thành công`);
          } else {
            this._notifyService.showError(`Tạo mới thất bại`);
          }
        }),
        switchMap((_) => this._testTypeService.findAll()),
        switchMap((obj: ObjectResponsePaging<TestType>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe(
        (testTypes: TestType[]) => {
          this.testTypes = testTypes;
          this.clearForm();
        });
  }

  clearForm(): void {
    this.submitted = false;
    this.disableBtn = false;
    this.selectedBlock = {};
    this.form.reset();
  }

  validateBeforeSaveOrUpdate(): boolean {
    //confirm submit
    this.submitted = true;
    this.disableBtn = true;

    const isInvalidDropdown = !this.selectedBlock || !this.selectedType;

    // validate data
    if (isInvalidDropdown || this.form.invalid) {
      this._notifyService.showWarning('Vui lòng kiểm tra lại thông tin');
      this.disableBtn = false;
      return false;
    }

    return true;
  }

  update(): void {

    if (!this.validateBeforeSaveOrUpdate()) {
      return;
    }

    this.testType.type = this.selectedType;
    this.testType.block = this.selectedBlock?.id;

    this._testTypeService
      .update(this.testType)
      .pipe(
        take(1),
        tap((result) => {
          if(result){
            this.isOpenDialog = false;
            this._notifyService.showSuccess(`Cập nhật ${this.testType.testTypeName} thành công`);
          } else {
            this._notifyService.showError(`Cập nhật thất bại`);
          }
        }),
        switchMap((_) => this._testTypeService.findAll()),
        switchMap((obj: ObjectResponsePaging<TestType>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe(
        (testTypes: TestType[]) => {
          this.testTypes = testTypes;
          this.clearForm();
        });
  }

  onCreate(): void {
    this.testType = {};
    this.selectedType = undefined;
    this.selectedBlock = undefined;
    this.isOpenDialog = true;
    this.submitted = false;
    this.isEditing = false;
    this.disableBtn = false;
  }

  openUpdateDialog(): void {
    this.isOpenDialog = true;
  }

  onPagingChange(paging: Paging): void {
    this._testTypeService
      .findAll(paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<TestType>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.testTypes = data;
      });
  }

  onDelete(testType: TestType): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa Kiến thức này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDelete(testType),
    });
  }

  private handlerDelete(testType: TestType): void {
    this._testTypeService
      .deleteById(testType.id)
      .pipe(
        take(1),
        tap(
          (_) =>
            _ && this._notifyService.showSuccess('Xóa Kiến thức thành công')
        ),
        switchMap((_) => this._testTypeService.findAll()),
        switchMap((obj: ObjectResponsePaging<TestType>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data: TestType[]) => {
        this.testTypes = data;
      });
  }

  onEdit(testType: TestType): void {
    this.testType = testType;
    this.disableBtn = false;
    this.isOpenDialog = true;
    this.submitted = false;
    this.isEditing = true;

    this.bindingSelected(testType);
  }

  private bindingSelected(testType: TestType): void {
    this.selectedBlock = [...this.blocks].find(
      (t: Block) => (testType.block as Block).id === t.id
    ) as Block;
    this.selectedType = testType.type as ETestType;
  }

  onSelected(testTypes: TestType[]): void {
    this.selectedTestTypes = testTypes;
  }

  onDeleteAllTestTypes(): void {
    this._confirmationService.confirm({
      message: 'Bạn có muốn xóa các Bài Kiểm Tra này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMultiTestTypes(),
    });
  }

  private handlerDeleteMultiTestTypes(): void {
    const ids = [...this.selectedTestTypes].map(
      (b: TestType) => b.id as string
    );

    this._testTypeService
      .deleteByIds(ids)
      .pipe(
        take(1),
        map(Mapping.toResponeDeletedByIds),
        tap((data) => {
          if (data.successes.length) {
            this.selectedTestTypes = [];
            this._notifyService.showSuccess(
              `Đã xóa các Bài Kiểm Tra: ${data.successes.join(', ')} thành công!`
            );
          }
          if (data.errors.length) {
            this._notifyService.showError(
              `Không thể xóa các Bài Kiểm Tra: ${data.successes.join(', ')}!`
            );
          }
        }),
        switchMap((_) => this._testTypeService.findAll()),
        switchMap((obj: ObjectResponsePaging<TestType>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.testTypes = data;
      });
  }
}

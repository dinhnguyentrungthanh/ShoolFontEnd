import { Point, TestResult } from './../../../../@core/model/point.model';
import { User } from './../../../../@core/model/user.model';
import { ETestType, TestType } from './../../../../@core/model/testType.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { AdminConstraint } from 'src/app/@core/common/admin.constraint';
import { Test } from 'src/app/@core/model/test.model';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { PointService } from 'src/app/@core/service/point.service';
import { TestService } from 'src/app/@core/service/test.service';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-point-multi-choice-detail',
  templateUrl: './point-multi-choice-detail.component.html',
  styleUrls: ['./point-multi-choice-detail.component.scss']
})
export class PointMultiChoiceDetailComponent implements OnInit, OnDestroy {

  pointId = '';

  user: User = {};

  testTypeId = '';

  tests: Test[] = [];

  tests$!: Observable<Test[]>;

  point!: Point;

  isShowDialogPoint = false;

  loading = false;

  destroy$: ReplaySubject<any> = new ReplaySubject<any>(1);

  form!: FormGroup;

  submitted = false;

  testResultMap: TestResult[] = [];

  type = ETestType;

  dbType!: ETestType;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _pointService: PointService,
    private _testService: TestService,
    private _fb: FormBuilder,
    private _notifyService: NotifyService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  ngOnInit(): void {
    this.tests$ = this._route.params
    .pipe(
      takeUntil(this.destroy$),
      tap(params => this.pointId = params.id),
      switchMap(params => this._pointService.findById(params.id)),
      tap((point: Point) => {
        if(point.type !== ETestType.MULTI_CHOICE){
          this._router.navigate([AdminConstraint.NOT_FOUND]);
          return;
        }
        this.point = point;
        this.user = point.user as User;
        this.dbType = (point.testType as TestType).type as ETestType;
        this.testTypeId = (point.testType as TestType).id as string;
      }),
      switchMap((_) => this._testService.findAllNotPagingByTestTypeId(this.testTypeId)),
      tap((tests: Test[]) => {
        this.testResultMap = tests.map((t, index) => {
          const item = this.point.testMemo.find(i => i.id === t.id ) as TestResult;
          item.question = t.question;
          return item;
        });
        this.loading = false;
      },
      (error) => {
        this._router.navigate([AdminConstraint.NOT_FOUND]);
      }
      ),
    );

    this.form = this._fb.group({
      point: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  get f(): any {
    return this.form.controls;
  }

  complete(): void {
    this.isShowDialogPoint = true;
  }

  save(): void {
    this.submitted = true;

    if(this.form.invalid){
      this._notifyService.showWarning('Vui lòng kiểm tra lại dữ liệu!');
      this.submitted = false;
      return;
    }

    const data = {...this.point};
    data.testType = (data.testType as TestType).id;
    data.user = (data.user as User).id;

    this._pointService.update(data)
    .pipe(
      take(1)
    )
    .subscribe((point: Point) => {
      this._notifyService.showSuccess('Cập nhật điểm thành công!');
      this.point = point;
      this.submitted = false;
      this.isShowDialogPoint = false;
    }, () => this.submitted = false);
  }
}

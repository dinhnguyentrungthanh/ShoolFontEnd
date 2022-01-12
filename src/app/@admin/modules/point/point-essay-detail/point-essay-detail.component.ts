import { NotifyService } from './../../../../@core/service/notify.service';
import { User } from './../../../../@core/model/user.model';
import { Test } from './../../../../@core/model/test.model';
import { TestType } from './../../../../@core/model/testType.model';
import { TestService } from './../../../../@core/service/test.service';
import { AdminConstraint } from './../../../../@core/common/admin.constraint';
import { PointService } from 'src/app/@core/service/point.service';
import { Point } from 'src/app/@core/model/point.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, take, tap, takeUntil } from 'rxjs/operators';
import { ETestType } from 'src/app/@core/model/testType.model';
import { Observable, ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-point-essay-detail',
  templateUrl: './point-essay-detail.component.html',
  styleUrls: ['./point-essay-detail.component.scss']
})
export class PointEssayDetailComponent implements OnInit, OnDestroy {

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
        if(point.type !== ETestType.ESSAY){
          this._router.navigate([AdminConstraint.NOT_FOUND]);
          return;
        }
        this.point = point;
        this.user = point.user as User;
        this.testTypeId = (point.testType as TestType).id as string;
      }),
      switchMap((_) => this._testService.findAllNotPagingByTestTypeId(this.testTypeId)),
      tap((tests: Test[]) => (this.tests = tests)),
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

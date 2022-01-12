import { AdminConstraint } from './../../../@core/common/admin.constraint';
import { TestType } from './../../../@core/model/testType.model';
import { TestResult } from './../../../@core/model/point.model';
import { TestService } from './../../../@core/service/test.service';
import { Test } from 'src/app/@core/model/test.model';
import { PointService } from './../../../@core/service/point.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { tap, switchMap } from 'rxjs/operators';
import { Point } from 'src/app/@core/model/point.model';
import { of } from 'rxjs';
import { ETestType } from 'src/app/@core/model/testType.model';

@Component({
  selector: 'app-my-test-detail',
  templateUrl: './my-test-detail.component.html',
  styleUrls: ['./my-test-detail.component.scss']
})
export class MyTestDetailComponent implements OnInit {

  point!: Point;

  pointId = '';

  loading = false;

  tests: Test[] = [];

  testResultMap: TestResult[] = [];

  type = ETestType;

  dbType!: ETestType;

  constructor(
    private _route: ActivatedRoute,
    private _pointService: PointService,
    private _testService: TestService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this._route.params
    .pipe(
      tap(params => this.pointId = params.id),
      switchMap(params => this._pointService.findById(params.id)),
      tap((point: Point) => {
        this.point = point;
        this.dbType = (point.testType as TestType).type as ETestType;
      }),
      switchMap((point: Point) => {
        const testIds = [...point.testMemo].map(t => t.id);
        return this._testService.findByIds(testIds);
      })
    )
    .subscribe((tests: Test[]) => {
      this.testResultMap = tests.map((t, index) => {
        const item = this.point.testMemo.find(i => i.id === t.id ) as TestResult;
        item.question = t.question;
        return item;
      });
      this.loading = false;
    },
    (error) => {
      this._router.navigate([AdminConstraint.NOT_FOUND]);
    });
  }

}

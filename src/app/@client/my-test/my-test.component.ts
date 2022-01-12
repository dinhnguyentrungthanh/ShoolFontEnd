import { TestingService } from './../../@core/service/testing.service';
import { AdminConstraint } from './../../@core/common/admin.constraint';
import { Router } from '@angular/router';
import { Point } from './../../@core/model/point.model';
import { ETestType } from 'src/app/@core/model/testType.model';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/@core/service/auth.service';
import { PointService } from './../../@core/service/point.service';
import { TestService } from './../../@core/service/test.service';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';
import { Test } from 'src/app/@core/model/test.model';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-test',
  templateUrl: './my-test.component.html',
  styleUrls: ['./my-test.component.scss']
})
export class MyTestComponent implements OnInit {

  points: Point[] = [];

  loading = false;

  type = ETestType;

  constructor(
    private _pointService: PointService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {

    this.loading = true;
    this._pointService.findAllNotPagingByUserId(this._authService.getId())
    .pipe(
      take(1)
    )
    .subscribe((points: Point[]) => {
      this.points = points.sort((a, b) => {
        const aDate = (a as Point)?.createdDate;
        const bDate = (b as Point)?.createdDate;
        if(aDate && bDate && aDate > bDate){
          return -1;
        }
        return 1;
      });
      this.loading = false;
    },
    (error) => {
      this._router.navigate([AdminConstraint.NOT_FOUND]);
    }
    );
  }

}

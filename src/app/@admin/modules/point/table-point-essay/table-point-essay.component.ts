import { Paging } from './../../../../@core/model/paging.model';
import { switchMap, take, tap } from 'rxjs/operators';
import {
  PagingFunction,
} from './../../../../@core/utils/PagingFunction';
import { Point } from './../../../../@core/model/point.model';
import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/@core/service/helper.service';
import { PointService } from 'src/app/@core/service/point.service';
import { ETestType } from 'src/app/@core/model/testType.model';
import { ObjectResponsePaging } from 'src/app/@core/model/paging.model';
import { rowsPerPageOptions } from 'src/app/@core/config/paging.config';

@Component({
  selector: 'app-table-point-essay',
  templateUrl: './table-point-essay.component.html',
  styleUrls: ['./table-point-essay.component.scss'],
})
export class TablePointEssayComponent extends PagingFunction implements OnInit {
  points: Point[] = [];

  rowsPerPageOptions: number[] = rowsPerPageOptions;

  loading = false;

  constructor(
    private _helperService: HelperService,
    private _pointService: PointService
  ) {
    super();
  }

  ngOnInit(): void {
    this._fetchAllData();
  }

  private _fetchAllData(): void {
    this.loading = true;
    this._pointService.findAllByType(ETestType.ESSAY).pipe(
      take(1),
      switchMap((obj: ObjectResponsePaging<Point>) =>
        this._helperService.bindingPaging(obj, this)
      ),
      tap((points: Point[]) => (this.points = points))
    ).subscribe(() => this.loading = false, () => this.loading = false);
  }

  onPaginate(event: any): void {
    const paging: Paging = {
      currentPage: event.page,
      size: event.rows,
    };
    this._pointService
      .findAllByType(ETestType.ESSAY, paging)
      .pipe(
        switchMap((obj: ObjectResponsePaging<Point>) =>
          this._helperService.bindingPaging(obj, this)
        )
      )
      .subscribe((data) => {
        this.points = data;
      });
  }
}

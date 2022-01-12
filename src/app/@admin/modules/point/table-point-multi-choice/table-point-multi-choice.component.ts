import { Component, OnInit } from '@angular/core';
import { take, switchMap, tap } from 'rxjs/operators';
import { rowsPerPageOptions } from 'src/app/@core/config/paging.config';
import { ObjectResponsePaging, Paging } from 'src/app/@core/model/paging.model';
import { Point } from 'src/app/@core/model/point.model';
import { ETestType } from 'src/app/@core/model/testType.model';
import { HelperService } from 'src/app/@core/service/helper.service';
import { PointService } from 'src/app/@core/service/point.service';
import { PagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-table-point-multi-choice',
  templateUrl: './table-point-multi-choice.component.html',
  styleUrls: ['./table-point-multi-choice.component.scss']
})
export class TablePointMultiChoiceComponent extends PagingFunction implements OnInit {

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
    this._pointService.findAllByType(ETestType.MULTI_CHOICE).pipe(
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
      .findAllByType(ETestType.MULTI_CHOICE, paging)
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

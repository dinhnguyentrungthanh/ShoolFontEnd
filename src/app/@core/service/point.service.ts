import { StringUtils } from './../utils/string.util';
import { Point } from './../model/point.model';
import { ETestType, TestType } from '../model/testType.model';
import { catchError, map } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Observable, of } from 'rxjs';
import { Paging, ObjectResponsePaging } from '../model/paging.model';
import { NotifyService } from './notify.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseService } from './ibase.service';

@Injectable({
  providedIn: 'root'
})
export class PointService extends IBaseService {

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService,
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Point>> {
    return this._http.get<ObjectResponsePaging<Point>>(this.sendToUsingPaging(ApiConstraint.POINT, paging))
      .pipe();
  }

  findAllNotPaging(): Observable<Point[]>{
    return this._http.get<Point[]>(this.sendToNotUsingPaging(ApiConstraint.POINT));
  }

  findById(id: string): Observable<Point> {
    return this._http
      .get<any>(this.sendTo(StringUtils.format(ApiConstraint.POINT_ID, id)))
      .pipe(map((res) => res as Point));
  }

  update(data: Point): Observable<Point> {
    return this._http
      .put<Point>(
        this.sendTo(StringUtils.format(ApiConstraint.POINT_ID, data.id)),
        data
      )
      .pipe(map((res) => res as Point));
  }

  save(data: Point): Observable<Point> {
    return this._http
      .post<Point>(
        this.sendTo(ApiConstraint.POINT),
        data
      )
      .pipe(map((res) => res as Point));
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http
      .delete<any>(
        this.sendTo(StringUtils.format(ApiConstraint.POINT_ID, id))
      )
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Bài Kiểm tra không thành công'))
        )
      );
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http
      .patch<any>(this.sendTo(ApiConstraint.POINT), ids)
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa các Bài Kiểm tra không thành công!'))
        )
      );
  }

  updateStream(data: Point): Observable<Point> {
    return this._http
      .put<Point>(
        this.sendTo(StringUtils.format(ApiConstraint.POINT_ID_STREAM, data.id)),
        data
      )
      .pipe(map((res) => res as Point));
  }

  findAllByUserId(userId: string, paging?: Paging): Observable<ObjectResponsePaging<Point>> {
    const knQuery = paging ? '&' : '?' + `userId=${userId}`;
    return this._http.get<ObjectResponsePaging<Point>>(this.sendToUsingPaging(ApiConstraint.POINT, paging) + knQuery)
      .pipe();
  }

  findAllNotPagingByUserId(userId: string): Observable<Point[]>{
    return this._http.get<Point[]>(this.sendToNotUsingPaging(ApiConstraint.POINT) + `&userId=${userId}`);
  }

  findAllByType(type: ETestType, paging?: Paging): Observable<ObjectResponsePaging<Point>> {
    const knQuery = paging ? '&' : '?' + `type=${type}`;
    return this._http.get<ObjectResponsePaging<Point>>(this.sendToUsingPaging(ApiConstraint.POINT, paging) + knQuery)
      .pipe();
  }

  findAllNotPagingByType(type: ETestType): Observable<Point[]>{
    return this._http.get<Point[]>(this.sendToNotUsingPaging(ApiConstraint.POINT) + `&type=${type}`);
  }

}

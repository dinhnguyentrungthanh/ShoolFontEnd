import { TestType } from './../model/testType.model';
import { catchError, map } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Observable, of } from 'rxjs';
import { Paging, ObjectResponsePaging } from '../model/paging.model';
import { NotifyService } from './notify.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseService } from './ibase.service';
import { StringUtils } from '../utils/string.util';

@Injectable({
  providedIn: 'root',
})
export class TestTypeService extends IBaseService {
  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<TestType>> {
    return this._http
      .get<ObjectResponsePaging<TestType>>(
        this.sendToUsingPaging(ApiConstraint.TEST_TYPE, paging)
      )
      .pipe();
  }

  findAllNotPaging(): Observable<any> {
    return this._http.get(
      this.sendToNotUsingPaging(`${ApiConstraint.TEST_TYPE}`)
    );
  }

  findAllByBlockSeo(blockSeo: string, paging?: Paging): Observable<ObjectResponsePaging<TestType>> {
    const knQuery = paging ? '&' : '?' + `blockSeo=${blockSeo}`;
    return this._http
      .get<ObjectResponsePaging<TestType>>(
        this.sendToUsingPaging(ApiConstraint.TEST_TYPE, paging) + knQuery
      );
  }

  findAllNotPagingByBlockSeo(blockSeo: string): Observable<TestType[]>{
    return this._http.get<TestType[]>(this.sendToNotUsingPaging(ApiConstraint.TEST_TYPE) + `&blockSeo=${blockSeo}`);
  }

  findById(id: string): Observable<TestType> {
    return this._http
      .get<any>(this.sendTo(StringUtils.format(ApiConstraint.TEST_TYPE_ID, id)))
      .pipe(map((res) => res as TestType));
  }

  save(testType: TestType): Observable<any> {
    return this._http
      .post<any>(this.sendTo(`${ApiConstraint.TEST_TYPE}`), testType)
      .pipe(map((res) => res as TestType));
  }

  update(testType: TestType): Observable<any> {
    return this._http
      .put<any>(
        this.sendTo(StringUtils.format(ApiConstraint.TEST_TYPE_ID, testType.id)),
        testType
      )
      .pipe(map((res) => res as TestType));
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http
      .delete<any>(
        this.sendTo(StringUtils.format(ApiConstraint.TEST_TYPE_ID, id))
      )
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Bài Kiểm tra không thành công'))
        )
      );
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http
      .patch<any>(this.sendTo(ApiConstraint.TEST_TYPE), ids)
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Bài Kiểm tra không thành công!'))
        )
      );
  }
}

import { Test } from './../model/test.model';
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
  providedIn: 'root'
})
export class TestService extends IBaseService {

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService,
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Test>> {
    return this._http
      .get<ObjectResponsePaging<Test>>(
        this.sendToUsingPaging(ApiConstraint.TEST, paging)
      )
      .pipe();
  }

  findAllNotPaging(): Observable<any> {
    return this._http.get(
      this.sendToNotUsingPaging(`${ApiConstraint.TEST}`)
    );
  }

  findAllByTestTypeId(ttId: string, paging?: Paging): Observable<ObjectResponsePaging<Test>> {
    const ttQuery = paging ? '&' : '?' + `testTypeId=${ttId}`;
    return this._http
      .get<ObjectResponsePaging<Test>>(
        this.sendToUsingPaging(ApiConstraint.TEST, paging) + ttQuery
      )
      .pipe();
  }

  findAllNotPagingByTestTypeId(ttId: string): Observable<Test[]>{
    return this._http.get<Test[]>(this.sendToNotUsingPaging(ApiConstraint.TEST) + `&testTypeId=${ttId}`);
  }

  findById(id: string): Observable<Test> {
    return this._http
      .get<any>(this.sendTo(StringUtils.format(ApiConstraint.TEST_ID, id)))
      .pipe(map((res) => res as Test));
  }

  findByIds(ids: Array<string>): Observable<Test[]> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.TEST}/ids`),ids)
      .pipe(
        map(res => res as Test[])
      );
  }

  save(Test: Test): Observable<any> {
    return this._http
      .post<any>(this.sendTo(`${ApiConstraint.TEST}`), Test)
      .pipe(map((res) => res as Test));
  }

  saveEssay(Test: Test): Observable<any> {
    return this._http
      .post<any>(this.sendTo(`${ApiConstraint.TEST_ESSAY}`), Test)
      .pipe(map((res) => res as Test));
  }

  update(Test: Test): Observable<any> {
    return this._http
      .put<any>(
        this.sendTo(StringUtils.format(ApiConstraint.TEST_ID, Test.id)),
        Test
      )
      .pipe(map((res) => res as Test));
  }

  updateEssay(Test: Test): Observable<any> {
    return this._http
      .put<any>(
        this.sendTo(StringUtils.format(ApiConstraint.TEST_ID, Test.id)),
        Test
      )
      .pipe(map((res) => res as Test));
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http
      .delete<any>(
        this.sendTo(StringUtils.format(ApiConstraint.TEST_ID, id))
      )
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Bài Kiểm tra không thành công'))
        )
      );
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http
      .patch<any>(this.sendTo(ApiConstraint.TEST), ids)
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Bài Kiểm tra không thành công!'))
        )
      );
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { MathDesign } from '../model/base.mathDesign';
import { Major } from '../model/major.model';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { StringUtils } from '../utils/string.util';
import { IBaseService } from './ibase.service';
import { MajorService } from './major.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class MathdesignService extends IBaseService{

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService
    ) {
      super();
    }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<MathDesign>> {
    return this._http.get<ObjectResponsePaging<MathDesign>>(this.sendToUsingPaging(ApiConstraint.MATHDESIGN, paging))
      .pipe();
  }

  findAllNotPaging(): Observable<MathDesign[]>{
    return this._http.get<MathDesign[]>(this.sendToNotUsingPaging(ApiConstraint.MATHDESIGN));
  }

  findById(id: string): Observable<MathDesign>{
    return this._http.get<any>(this.sendTo(`${ApiConstraint.MATHDESIGN}/${id}`))
        .pipe(
          map(res => res as MathDesign)
        );
  }

  findByIds(ids: Array<string>): Observable<MathDesign[]> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.MATHDESIGN}/ids`),ids)
      .pipe(
        map(res => res as MathDesign[])
      );
  }

  deleteById(id: string | undefined): Observable<any>{
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.MATHDESIGN}/${id}`))
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Dạng Toán không thành công'))));
  }

  deleteByIds(ids: Array<string>): Observable<any>{
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.MATHDESIGN}`), ids)
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Dạng Toán  không thành công!'))));
  }

  save(mathDesigns: MathDesign): Observable<any>{
    return this._http.post<any>(this.sendTo(`${ApiConstraint.MATHDESIGN}`), mathDesigns)
    .pipe(
      map(res => res as MathDesign)
    );
  }

  update(mathDesigns: MathDesign): Observable<any>{
    return this._http.put<any>(this.sendTo(`${ApiConstraint.MATHDESIGN}/${mathDesigns.id}`), mathDesigns)
    .pipe(
      map(res => res as MathDesign)
    );
  }

  fetchAllFromBlocks(blockIds: string[]): Observable<MathDesign[]> {
    return this._http.post<any>(this.sendTo(ApiConstraint.SEARCH_MATHDESIGN_FROM_BLOCK), blockIds);
  }
}

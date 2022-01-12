import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Block } from '../model/block.model';
import { Major } from '../model/major.model';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { BlockService } from './block.service';
import { IBaseService } from './ibase.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class MajorService extends IBaseService {

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService,
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Major>> {
    return this._http.get<ObjectResponsePaging<Major>>(this.sendToUsingPaging(ApiConstraint.MAJOR, paging))
    .pipe();
  }

  findAllNotPaging(): Observable<Major[]>{
    return this._http.get<Major[]>(this.sendToNotUsingPaging(ApiConstraint.MAJOR));
  }

  findById(id: string): Observable<Major> {
    return this._http.get<any>(this.sendTo(`${ApiConstraint.MAJOR}/${id}`))
      .pipe(
        map(res => res as Major)
      );
  }

  findByIds(ids: Array<string>): Observable<Major[]> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.MAJOR}/ids`),ids)
      .pipe(
        map(res => res as Major[])
      );
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.MAJOR}/${id}`))
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa Môn không thành công'))));
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.MAJOR}`), ids)
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa Môn không thành công!'))));
  }

  save(majors: Major): Observable<any> {
    return this._http.post<any>(this.sendTo(`${ApiConstraint.MAJOR}`), majors)
      .pipe(
        map(res => res as Major)
      );
  }

  update(major: Major): Observable<any> {
    if(typeof major.block === 'object'){
      major.block = major.block.id;
    }
    return this._http.put<any>(this.sendTo(`${ApiConstraint.MAJOR}/${major.id}`), major)
      .pipe(
        map(res => res as Major)
      );
  }
}

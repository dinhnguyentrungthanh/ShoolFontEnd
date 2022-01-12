import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { Rolegroup } from '../model/rolegroup.model';
import { IBaseService } from './ibase.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class RolegroupService extends IBaseService{

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService,
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Rolegroup>> {
    return this._http.get<ObjectResponsePaging<Rolegroup>>(this.sendToUsingPaging(ApiConstraint.ROLEGROUP, paging))
    .pipe();
  }

  findAllNotPaging(): Observable<Rolegroup[]>{
    return this._http.get<Rolegroup[]>(this.sendToNotUsingPaging(ApiConstraint.ROLEGROUP));
  }

  findById(id: string): Observable<Rolegroup> {
    return this._http.get<any>(this.sendTo(`${ApiConstraint.ROLEGROUP}/${id}`))
      .pipe(
        map(res => res as Rolegroup)
      );
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.ROLEGROUP}/${id}`))
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa Quyền không thành công'))));
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.ROLEGROUP}`), ids)
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa Quyền không thành công!'))));
  }

  save(rgs: Rolegroup): Observable<any> {
    return this._http.post<any>(this.sendTo(`${ApiConstraint.ROLEGROUP}`), rgs)
      .pipe(
        map(res => res as Rolegroup)
      );
  }

  update(rgs: Rolegroup): Observable<any> {
    return this._http.put<any>(this.sendTo(`${ApiConstraint.ROLEGROUP}/${rgs.id}`), rgs)
      .pipe(
        map(res => res as Rolegroup)
      );
  }
}

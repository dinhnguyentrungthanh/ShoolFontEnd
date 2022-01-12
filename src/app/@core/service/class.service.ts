import { StringUtils } from './../utils/string.util';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Class } from '../model/base.class';
import { BlockService } from './block.service';
import { IBaseService } from './ibase.service';
import { UserService } from './user.service';
import { NotifyService } from './notify.service';
import { ObjectResponsePaging, Paging } from '../model/paging.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService extends IBaseService {

  constructor(
    private _http: HttpClient,
    private _blockService: BlockService,
    private _userService: UserService,
    private _notifyService: NotifyService
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Class>> {
    return this._http.get<ObjectResponsePaging<Class>>(this.sendToUsingPaging(ApiConstraint.CLASS, paging))
    .pipe();
  }

  findAllNotPaging(): Observable<Class[]>{
    return this._http.get<Class[]>(this.sendToNotUsingPaging(ApiConstraint.CLASS));
  }

  findById(id: string): Observable<Class>{
    return this._http.get<Class>(this.sendTo(`${ApiConstraint.CLASS}/${id}`))
        .pipe();
  }

  deleteById(id: string | undefined): Observable<any>{
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.CLASS}/${id}`))
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Lớp không thành công'))));
  }

  deleteByIds(ids: Array<string>): Observable<any>{
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.CLASS}`), ids)
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Khối không thành công!'))));
  }

  save(classes: Class): Observable<any>{
    return this._http.post<any>(this.sendTo(`${ApiConstraint.CLASS}`), classes)
    .pipe(
      map(res => res as Class)
    );
  }

  update(classes: Class): Observable<any>{
    return this._http.put<any>(this.sendTo(`${ApiConstraint.CLASS}/${classes.id}`), classes)
    .pipe(
      map(res => res as Class)
    );
  }

  deleteUserFromClassById(classId: string, userId: string): Observable<any>{
    return this._http.delete<any>(this.sendTo(StringUtils.format(ApiConstraint.CLASS_ID_USER_ID, classId, userId)))
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Học Sinh không thành công'))));
  }

  deleteUsersFromClassByIds(classId: string, ids: Array<string>): Observable<any>{
    return this._http.patch<any>(this.sendTo(StringUtils.format(ApiConstraint.CLASS_ID_USER, classId)), ids)
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Học Sinh không thành công!'))));
  }

}

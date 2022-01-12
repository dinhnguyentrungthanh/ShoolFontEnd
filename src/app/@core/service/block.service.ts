import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, never, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Chapter } from '../model/base.chapter';
import { Block } from '../model/block.model';
import { Major } from '../model/major.model';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { StringUtils } from '../utils/string.util';
import { ClassService } from './class.service';
import { IBaseService } from './ibase.service';
import { MajorService } from './major.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService extends IBaseService{

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Block>>{
    return this._http.get<ObjectResponsePaging<Block>>(this.sendToUsingPaging(ApiConstraint.BLOCK, paging))
    .pipe();
  }

  findAllNotPaging(): Observable<Block[]>{
    return this._http.get<Block[]>(this.sendToNotUsingPaging(ApiConstraint.BLOCK));
  }

  deleteById(id: string | undefined): Observable<any>{
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.BLOCK}/${id}`))
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Khối không thành công'))));
  }

  findById(id: string): Observable<Block>{

    return this._http.get<any>(this.sendTo(`${ApiConstraint.BLOCK}/${id}`))
        .pipe(
          map(res => res as Block)
        );
  }

  deleteByIds(ids: Array<string>): Observable<any>{
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.BLOCK}`), ids)
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Khối không thành công!'))));
  }

  save(block: Block): Observable<any>{
    return this._http.post<any>(this.sendTo(`${ApiConstraint.BLOCK}`), block)
    .pipe(
      map(res => res as Block)
    );
  }

  update(block: Block): Observable<any>{
    return this._http.put<any>(this.sendTo(`${StringUtils.format(ApiConstraint.BLOCK_ID, block.id)}`), block)//
    .pipe(
      map(res => res as Block)
    );
  }

  deleteMajors(blockId: string, ids: Array<string>): Observable<any>{
    return this._http.patch<any>(this.sendTo(StringUtils.format(ApiConstraint.BLOCK_BY_MAJOR, blockId)), ids)
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Khối không thành công!'))));
  }

  deleteClasses(blockId: string, ids: Array<string>): Observable<any>{
    return this._http.patch<any>(this.sendTo(StringUtils.format(ApiConstraint.BLOCK_BY_CLASS, blockId)), ids)
        .pipe(catchError(_ => of(this._notifyService.showError('Xóa Lớp không thành công!'))));
  }

  findByUrl(url: string): Observable<Block>{
    return this._http.get<any>(this.sendTo(StringUtils.format(ApiConstraint.BLOCK_BY_URL, url)))
        .pipe(
          map(res => res as Block)
        );
  }
}

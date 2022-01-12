import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Chapter } from '../model/base.chapter';
import { MathDesign } from '../model/base.mathDesign';
import { Block } from '../model/block.model';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { StringUtils } from '../utils/string.util';
import { BlockService } from './block.service';
import { IBaseService } from './ibase.service';
import { MathdesignService } from './mathdesign.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class ChapterService extends IBaseService {

  constructor(
    private _http: HttpClient,
    private _messageService: MessageService,
    private _blockService: BlockService,
    private _mathDesignService: MathdesignService,
    private _notifyService: NotifyService,
    private _route: Router
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Chapter>> {
    return this._http.get<ObjectResponsePaging<Chapter>>(this.sendToUsingPaging(ApiConstraint.CHAPTER, paging))
      .pipe();
  }

  findAllNotPaging(): Observable<Chapter[]> {
    return this._http.get<Chapter[]>(this.sendToNotUsingPaging(ApiConstraint.CHAPTER));
  }

  findById(id: string): Observable<Chapter> {
    return this._http.get<Chapter>(this.sendTo(`${ApiConstraint.CHAPTER}/${id}`))
      .pipe();
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http.delete<any>(this.sendTo(`${ApiConstraint.CHAPTER}/${id}`))
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa Chương không thành công'))));
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http.patch<any>(this.sendTo(`${ApiConstraint.CHAPTER}`), ids)
      .pipe(catchError(_ => of(this._notifyService.showError('Xóa Chương không thành công!'))));
  }

  save(chapters: Chapter): Observable<any> {
    return this._http.post<any>(this.sendTo(`${ApiConstraint.CHAPTER}`), chapters)
      .pipe(
        map(res => res as Chapter)
      );
  }

  update(chapters: Chapter): Observable<any> {
    return this._http.put<any>(this.sendTo(`${ApiConstraint.CHAPTER}/${chapters.id}`), chapters)
      .pipe(
        map(res => res as Chapter)
      );
  }

  findAllTemp(): Observable<Chapter[]> {
    return this._http.get<any>(this.sendTo(ApiConstraint.CHAPTER))
      .pipe(
        map(res => res.elements)
      );
  }

  findAll1(): Observable<any[]> {
    return this._http.get<any>(this.sendTo(ApiConstraint.CHAPTER))
      .pipe(
        switchMap(res => {
          const chapters = res.elements as Chapter[];
          const block$ = chapters.map((c: Chapter) => of(c.block));
          const mathDesign$ = chapters.map((c: Chapter) => of(c.mathDesign));
          return forkJoin(block$, mathDesign$);
        })
      );
  }

  fetchAllFromMathDesigns(mdIds: string[]): Observable<Chapter[]> {
    return this._http.post<any>(this.sendTo(ApiConstraint.SEARCH_CHAPTER_FROM_MATHDESIGN), mdIds);
  }


  fetchAllFromBlockAndMajorAndMathdesign(blockSeo: string, majorSeo: string, mathdesignSeo: string): Observable<any> {
    const path = StringUtils.format(ApiConstraint.CLIENT_ENPOINT_CHAPTER_F_BLOCK_F_MAJOR_F_MATHDESIGN, blockSeo, majorSeo, mathdesignSeo);
    return this._http.get<any>(this.sendTo(path))
    .pipe(
      tap(_ => {} , _ => this._route.navigate(['/not-found']))
    );;
  }

}

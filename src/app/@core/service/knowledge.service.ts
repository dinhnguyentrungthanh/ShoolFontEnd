import { NotifyService } from './notify.service';
import { ChapterOfKnowledge } from './../model/knowledge.model';
import { ApiConstraint } from './../common/api.constraint';
import { AppModule } from './../../app.module';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { IBaseService } from './ibase.service';
import { Chapter } from '../model/base.chapter';
import { Knowledge } from '../model/knowledge.model';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { catchError, map, tap } from 'rxjs/operators';
import { StringUtils } from '../utils/string.util';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class KnowledgeService extends IBaseService {
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private _notifyService: NotifyService
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<Knowledge>> {
    return this._http
      .get<ObjectResponsePaging<Knowledge>>(
        this.sendToUsingPaging(ApiConstraint.KNOWLEDGE, paging)
      )
      .pipe();
  }

  findAllNotPaging(): Observable<Knowledge[]>{
    return this._http.get<Knowledge[]>(this.sendToNotUsingPaging(ApiConstraint.KNOWLEDGE));
  }

  findById(id: string): Observable<Knowledge> {
    return this._http
      .get<any>(this.sendTo(`${ApiConstraint.KNOWLEDGE}/${id}`))
      .pipe(map((res) => res as Knowledge));
  }

  searchByFilter(filter: any): Observable<Knowledge[]> {
    return this._http.post<Knowledge[]>(
      this.sendTo(ApiConstraint.SEARCH_KNOWLEDGE_BY_FILTER),
      filter
    );
  }

  update(knId: string, data: ChapterOfKnowledge): Observable<Knowledge> {
    return this._http
      .put<Knowledge>(
        this.sendTo(`${StringUtils.format(ApiConstraint.KNOWLEDGE_ID, knId)}`),
        data
      )
      .pipe(map((res) => res as Knowledge));
  }

  save(data: ChapterOfKnowledge): Observable<Knowledge> {
    return this._http
      .post<Knowledge>(
        this.sendTo(`${StringUtils.format(ApiConstraint.KNOWLEDGE)}`),
        data
      )
      .pipe(map((res) => res as Knowledge));
  }

  fetchAllFromBlockAndMajorAndMathdesignandChapterandKnowledge(
    blockSeo: string,
    majorSeo: string,
    mathdesignSeo: string,
    chapterSeo: string,
    knowledgeSeo: string
  ): Observable<Knowledge> {
    const path = StringUtils.format(
      ApiConstraint.CLIENT_ENPOINT_CHAPTER_F_BLOCK_F_MAJOR_F_MATHDESIGN_CHAPTER_KNOWLEDGE,
      blockSeo,
      majorSeo,
      mathdesignSeo,
      chapterSeo,
      knowledgeSeo
    );
    return this._http.get<Knowledge>(this.sendTo(path)).pipe(
      tap(
        (_) => {},
        (_) => this._route.navigate(['/not-found'])
      )
    );
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http
      .delete<any>(
        this.sendTo(StringUtils.format(ApiConstraint.KNOWLEDGE_ID, id))
      )
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Kiến thức không thành công'))
        )
      );
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http
      .patch<any>(this.sendTo(ApiConstraint.KNOWLEDGE), ids)
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Kiến thức không thành công!'))
        )
      );
  }
}

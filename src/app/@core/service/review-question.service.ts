import { ReviewQuestion } from './../model/review-question';
import { AppModule } from '../../app.module';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { IBaseService } from './ibase.service';
import { ObjectResponsePaging, Paging } from '../model/paging.model';
import { Router } from '@angular/router';
import { ApiConstraint } from '../common/api.constraint';
import { catchError, map } from 'rxjs/operators';
import { StringUtils } from '../utils/string.util';
import { NotifyService } from './notify.service';

@Injectable({ providedIn: 'root' })
export class ReviewQuestionService extends IBaseService {
  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService
  ) {
    super();
  }

  findAll(paging?: Paging): Observable<ObjectResponsePaging<ReviewQuestion>> {
    return this._http
      .get<ObjectResponsePaging<ReviewQuestion>>(
        this.sendToUsingPaging(ApiConstraint.REVIEWQUESTION, paging)
      )
      .pipe();
  }

  findAllNotPaging(): Observable<ReviewQuestion[]>{
    return this._http.get<ReviewQuestion[]>(this.sendToNotUsingPaging(ApiConstraint.REVIEWQUESTION));
  }

  findAllByKnowledgeId(knid: string, paging?: Paging): Observable<ObjectResponsePaging<ReviewQuestion>> {
    const knQuery = paging ? '&' : '?' + `knowledgeId=${knid}`;
    return this._http
      .get<ObjectResponsePaging<ReviewQuestion>>(
        this.sendToUsingPaging(ApiConstraint.REVIEWQUESTION, paging) + knQuery
      )
      .pipe();
  }

  findAllNotPagingByKnowledgeId(knid: string): Observable<ReviewQuestion[]>{
    return this._http.get<ReviewQuestion[]>(this.sendToNotUsingPaging(ApiConstraint.REVIEWQUESTION) + `&knowledgeId=${knid}`);
  }

  findById(id: string): Observable<ReviewQuestion> {
    return this._http
      .get<any>(this.sendTo(`${ApiConstraint.REVIEWQUESTION_ID}/${id}`))
      .pipe(map((res) => res as ReviewQuestion));
  }

  update(data: ReviewQuestion): Observable<ReviewQuestion> {
    return this._http
      .put<ReviewQuestion>(
        this.sendTo(
          `${StringUtils.format(ApiConstraint.REVIEWQUESTION_ID, data.id)}`
        ),
        data
      )
      .pipe(map((res) => res as ReviewQuestion));
  }

  save(data: ReviewQuestion): Observable<ReviewQuestion> {
    return this._http
      .post<ReviewQuestion>(
        this.sendTo(`${StringUtils.format(ApiConstraint.REVIEWQUESTION)}`),
        data
      )
      .pipe(map((res) => res as ReviewQuestion));
  }

  deleteById(id: string | undefined): Observable<any> {
    return this._http
      .delete<any>(
        this.sendTo(StringUtils.format(ApiConstraint.REVIEWQUESTION_ID, id))
      )
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa Câu hỏi không thành công'))
        )
      );
  }

  deleteByIds(ids: Array<string>): Observable<any> {
    return this._http
      .patch<any>(this.sendTo(ApiConstraint.REVIEWQUESTION), ids)
      .pipe(
        catchError((_) =>
          of(this._notifyService.showError('Xóa các Câu hỏi không thành công!'))
        )
      );
  }
}

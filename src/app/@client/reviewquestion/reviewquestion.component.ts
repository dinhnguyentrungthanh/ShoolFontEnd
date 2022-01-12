
import { CommentService } from './../../@core/service/comment.service';
import { NotifyService } from './../../@core/service/notify.service';
import { KnowledgeService } from './../../@core/service/knowledge.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewQuestionService } from 'src/app/@core/service/review-question.service';
import { Comment } from './../../@core/model/comment.model';
import { CountdownComponent } from 'ngx-countdown';
import { switchMap, tap } from 'rxjs/operators';
import { ReviewQuestion } from 'src/app/@core/model/review-question';

@Component({
  selector: 'app-reviewquestion',
  templateUrl: './reviewquestion.component.html',
  styleUrls: ['./reviewquestion.component.scss']
})
export class ReviewquestionComponent implements OnInit {

  prettyText = (text: string) => text;

  @ViewChild('cd', { static: false })
  private countdown!: CountdownComponent;


  idKnSeo = '';
  page = '1';
  rvs!: ReviewQuestion[];
  rv!: ReviewQuestion;

  constructor(
    private _route: ActivatedRoute,
    private _knowledgeService: KnowledgeService,
    private _reviewQuestionService: ReviewQuestionService,
    private _notifyService: NotifyService,
    private _commentService: CommentService
  ) { }

  ngOnInit(): void {
    // this._route.params
    // .pipe(
    //   tap((params: any) => {
    //     this.idKnSeo = params.idKnSeo;
    //     this.page = params.page;
    //   }),
    //   switchMap((params: any) =>
    //     this._reviewQuestionService.findAllByKnowledgeId(params.idKnSeo,params.page)
    //   )
    // )
    // .subscribe(rvs => {
    //   this.rvs = rvs as ReviewQuestion[];
    // });
  }

  start(){
    this.countdown.begin();
  }
}

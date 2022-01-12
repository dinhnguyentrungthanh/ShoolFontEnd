import { ActivatedRoute, Router } from '@angular/router';
import { Knowledge } from './../../@core/model/knowledge.model';
import { KnowledgeService } from 'src/app/@core/service/knowledge.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap, tap, mergeMap } from 'rxjs/operators';
import { ReviewQuestion } from 'src/app/@core/model/review-question';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { ReviewQuestionService } from 'src/app/@core/service/review-question.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss'],
})
export class KnowledgeComponent implements OnInit {
  knowledges!: Knowledge[];

  knowledge!: Knowledge;

  blockSeo = '';

  majorSeo = '';

  mathDesignSeo = '';

  chapterSeo = '';

  knowledgeSeo = '';

  reviewQuestions!: ReviewQuestion[];

  reviewQuestion!: ReviewQuestion;

  time = 0;

  currentIndex = -1;

  maxIndex = -1;

  isRunning = true;

  isDoTest = false;

  isShowAnswer = true;

  hasPrev = false;

  //prettyText = (text: string) => text;

  @ViewChild('cd', { static: false })
  private countdown!: CountdownComponent;

  constructor(
    private _knowledgeService: KnowledgeService,
    private _route: ActivatedRoute,
    private _reviewQuestionService: ReviewQuestionService
  ) {}

  ngOnInit(): void {
    this._route.params
      .pipe(
        tap((params: any) => {
          this.blockSeo = params.blockSeo;
          this.majorSeo = params.majorSeo;
          this.mathDesignSeo = params.mathDesignSeo;
          this.chapterSeo = params.chapterSeo;
          this.knowledgeSeo = params.knowledgeSeo;
        }),
        switchMap((params: any) =>
          this._knowledgeService.fetchAllFromBlockAndMajorAndMathdesignandChapterandKnowledge(
            params.blockSeo,
            params.majorSeo,
            params.mathDesignSeo,
            params.chapterSeo,
            params.knowledgeSeo
          )
        ),
        tap((data: Knowledge) => {
          this.knowledge = data;
        }),
        switchMap((data: Knowledge) =>
          this._reviewQuestionService.findAllNotPagingByKnowledgeId(
            data.id as string
          )
        )
      )
      .subscribe((data: ReviewQuestion[]) => this.initial(data));
  }

  start(): void {
    this.isRunning = true;
    this.isDoTest = true;
    this.currentIndex++;
    this.maxIndex = this.currentIndex;
    this.isShowAnswer = false;
    this.reviewQuestion = this.reviewQuestions[this.currentIndex];
    this.time = this.reviewQuestions[this.currentIndex].time as number;
    this.countdown.config = { leftTime: this.time, demand: true, format: 'mm:ss'};

    this.countdown.restart();
    this.countdown.begin();
  }

  initial(data: ReviewQuestion[]): void {
    this.reviewQuestions = data;
  }

  handleEvent(event: CountdownEvent): void {
    if (event.action === 'done') {
      this.isRunning = false;
      this.hasPrev = true;
      this.isShowAnswer = true;
    }
  }

  next(): void {
    if (this.currentIndex === this.maxIndex && this.currentIndex <= this.reviewQuestions.length - 1) {
      this.start();
    }
    if(this.currentIndex < this.maxIndex){
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}

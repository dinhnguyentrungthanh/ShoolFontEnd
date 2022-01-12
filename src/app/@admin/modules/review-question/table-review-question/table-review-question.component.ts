import { ReviewQuestion } from './../../../../@core/model/review-question';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';
import { Paging } from 'src/app/@core/model/paging.model';

@Component({
  selector: 'app-table-review-question',
  templateUrl: './table-review-question.component.html',
  styleUrls: ['./table-review-question.component.scss']
})
export class TableReviewQuestionComponent extends TablePagingFunction implements OnInit {

  @Input() reviewQuestions!: ReviewQuestion[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() isDynamic = false;

  @Output() onCreate = new EventEmitter<boolean>();
  @Output() onEdit = new EventEmitter<ReviewQuestion>();
  @Output() onDelete = new EventEmitter<ReviewQuestion>();
  @Output() onSelected = new EventEmitter<ReviewQuestion[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();
  @Output() onDeleteAll = new EventEmitter<boolean>();

  keviewQuestion!: ReviewQuestion;

  @Input() selectedReviewQuestions!: ReviewQuestion[];

  constructor() { super(); }

  ngOnInit(): void {
  }

  onEditReviewQuestion(r: ReviewQuestion): void {
    this.onEdit.emit(r);
  }

  onDeleteReviewQuestion(r: ReviewQuestion): void{
    this.onDelete.emit(r);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedReviewQuestions);
  }

  onDeleteAllReviewQuestion(): void {
    this.onDeleteAll.emit(true);
  }

  onCreateReviewQuestion(): void {
    this.onCreate.emit(true);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }

}

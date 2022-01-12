import { Knowledge } from 'src/app/@core/model/knowledge.model';
import { TablePagingFunction } from './../../../../@core/utils/PagingFunction';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Paging } from 'src/app/@core/model/paging.model';

@Component({
  selector: 'app-table-knowledge',
  templateUrl: './table-knowledge.component.html',
  styleUrls: ['./table-knowledge.component.scss']
})
export class TableKnowledgeComponent extends TablePagingFunction implements OnInit {

  @Input() knowledges!: Knowledge[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() isDynamic = false;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<Knowledge>();
  @Output() onDelete = new EventEmitter<Knowledge>();
  @Output() onSelected = new EventEmitter<Knowledge[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();
  @Output() onDeleteAll = new EventEmitter<boolean>();

  knowledge!: Knowledge;

  selectedKnowledges!: Knowledge[];

  constructor() { super(); }

  ngOnInit(): void {
  }

  onEditKnowledge(c: Knowledge): void {
    this.onEdit.emit(c);
  }

  onDeleteKnowledge(c: Knowledge): void{
    this.onDelete.emit(c);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedKnowledges);
  }

  onDeleteAllKnowledge(): void {
    this.onDeleteAll.emit(true);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }

}

import { TablePagingFunction } from './../../../../@core/utils/PagingFunction';
import { Paging } from './../../../../@core/model/paging.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Test } from 'src/app/@core/model/test.model';

@Component({
  selector: 'app-table-test',
  templateUrl: './table-test.component.html',
  styleUrls: ['./table-test.component.scss']
})
export class TableTestComponent extends TablePagingFunction implements OnInit {

  @Input() tests!: Test[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() isDynamic = false;
  @Input() loading = false;
  @Input() loadingCreating = false;
  @Input() loadingEditing = false;

  @Output() onEdit = new EventEmitter<Test>();
  @Output() onDelete = new EventEmitter<Test>();
  @Output() onSelected = new EventEmitter<Test[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();
  @Output() onCreate = new EventEmitter<boolean>();
  @Output() onDeleteAll = new EventEmitter<boolean>();

  Test!: Test;

  @Input() selectedTests!: Test[];

  constructor() { super(); }

  ngOnInit(): void {
  }

  onEditTest(c: Test): void {
    this.onEdit.emit(c);
  }

  onDeleteTest(c: Test): void{
    this.onDelete.emit(c);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedTests);
  }

  onDeleteAllTest(): void {
    this.onDeleteAll.emit(true);
  }

  onCreateTest(): void {
    this.onCreate.emit(true);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }

}

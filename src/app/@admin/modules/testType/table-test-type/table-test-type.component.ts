import { TablePagingFunction } from './../../../../@core/utils/PagingFunction';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Paging } from 'src/app/@core/model/paging.model';
import { ETestType, TestType } from 'src/app/@core/model/testType.model';

@Component({
  selector: 'app-table-test-type',
  templateUrl: './table-test-type.component.html',
  styleUrls: ['./table-test-type.component.scss']
})
export class TableTestTypeComponent extends TablePagingFunction implements OnInit {

  @Input() testTypes!: TestType[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() isDynamic = false;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<TestType>();
  @Output() onDelete = new EventEmitter<TestType>();
  @Output() onSelected = new EventEmitter<TestType[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();

  TestType!: TestType;

  @Input() selectedTestTypes!: TestType[];

  type = ETestType;

  constructor() { super(); }

  ngOnInit(): void {
  }

  onEditTestType(c: TestType): void {
    this.onEdit.emit(c);
  }

  onDeleteTestType(c: TestType): void{
    this.onDelete.emit(c);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedTestTypes);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Class } from 'src/app/@core/model/base.class';
import { Block } from 'src/app/@core/model/block.model';
import { Paging } from 'src/app/@core/model/paging.model';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-table-class',
  templateUrl: './table-class.component.html',
  styleUrls: ['./table-class.component.scss']
})
export class TableClassComponent extends TablePagingFunction implements OnInit {

  @Input() classes!: Class[];
  @Input() showColBlock = true;
  @Input() showColStudent = false;
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() isDynamic = false;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<Class>();
  @Output() onDelete = new EventEmitter<Class>();
  @Output() onShowStudent = new EventEmitter<Class>();
  @Output() onSelected = new EventEmitter<Class[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();

  class!: Class;

  selectedClasses!: Class[];

  constructor(public config: DynamicDialogConfig) { super(); }

  ngOnInit(): void {

    this.bindDataForDynamic();
  }

  bindData(): void {

  }

  bindDataForDynamic(): void {
    if (this.config.data && this.config.data.classes){
      this.isDynamic = true;
      this.classes = this.config.data && this.config.data.classes;
    }
  }

  onEditClass(c: Class): void {
    this.onEdit.emit(c);
  }

  onDeleteClass(c: Class): void{
    this.onDelete.emit(c);
  }

  showStudent(c: Class): void{
    this.onShowStudent.emit(c);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedClasses);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }

}

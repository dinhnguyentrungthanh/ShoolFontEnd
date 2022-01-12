import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Block } from 'src/app/@core/model/block.model';
import { Major } from 'src/app/@core/model/major.model';
import { Paging } from 'src/app/@core/model/paging.model';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-table-major',
  templateUrl: './table-major.component.html',
  styleUrls: ['./table-major.component.scss']
})
export class TableMajorComponent extends TablePagingFunction implements OnInit {

  @Input() majors!: Major[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() isDynamic = false;
  @Input() showColBlock = true;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<Major>();
  @Output() onDelete = new EventEmitter<Major>();
  @Output() onSelected = new EventEmitter<Major[]>();
  @Output() onShowMathDesign = new EventEmitter<Major>();
  @Output() onPagingChange = new EventEmitter<Paging>();

  major!: Major;

  selectedMajors!: Major[];

  blocks!: Block[];

  block!: Block;

  constructor(public config: DynamicDialogConfig) { super();}

  ngOnInit(): void {
  }

  bindDataForDynamic(): void {
    if (this.config.data && this.config.data.majors){
      this.isDynamic = true;
      this.majors = this.config.data && this.config.data.majors;
    }
  }

  editMajor(m: Major): void {
    this.onEdit.emit(m);
  }

  deleteMajor(m: Major): void{
    this.onDelete.emit(m);
  }

  onRowSelectOrUnSelect(): void{
    this.onSelected.emit(this.selectedMajors);
  }

  onShowMathDesignBtn(m: Major): void{
    this.onShowMathDesign.emit(m);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
}
}

import { Block } from './../../../../@core/model/block.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';
import { Paging } from 'src/app/@core/model/paging.model';
import { Major } from 'src/app/@core/model/major.model';

@Component({
  selector: 'app-table-block',
  templateUrl: './table-block.component.html',
  styleUrls: ['./table-block.component.scss']
})
export class TableBlockComponent extends TablePagingFunction implements OnInit {

  @Input() blocks!: Block[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<Block>();
  @Output() onDelete = new EventEmitter<Block>();
  @Output() onSelected = new EventEmitter<Block[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();
  @Output() onShowMajors = new EventEmitter<Block>();

  block!: Block;

  selectedBlocks!: Block[];

  constructor() { super(); }

  ngOnInit(): void {
  }

  showMajors(b: Block): void {
    this.onShowMajors.emit(b);
  }

  onEditBlock(b: Block): void {
    this.onEdit.emit(b);
  }

  onDeleteBlock(b: Block): void{
    this.onDelete.emit(b);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedBlocks);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }
}

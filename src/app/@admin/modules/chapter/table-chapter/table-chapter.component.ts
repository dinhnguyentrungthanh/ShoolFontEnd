import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Chapter } from 'src/app/@core/model/base.chapter';
import { Paging } from 'src/app/@core/model/paging.model';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-table-chapter',
  templateUrl: './table-chapter.component.html',
  styleUrls: ['./table-chapter.component.scss']
})
export class TableChapterComponent extends TablePagingFunction implements OnInit {

  @Input() chapters!: Chapter[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() loading = false;

  chapter!: Chapter;

  selectedChapter!: Chapter[];

  @Output() onEdit = new EventEmitter<Chapter>();
  @Output() onDelete = new EventEmitter<Chapter>();
  @Output() onSelected = new EventEmitter<Chapter[]>();
  @Output() onShowMathDesign = new EventEmitter<Chapter>();
  @Output() onPagingChange = new EventEmitter<Paging>();

  isDynamic = false;


  constructor( public config: DynamicDialogConfig) { super();}

  ngOnInit(): void {
    this.bindDataForDynamic();
  }

  bindDataForDynamic(): void {
    if(this.config.data){
      this.isDynamic = true;
      this.chapters = this.config.data.chapters;
    }

  }

  editChapter(c: Chapter): void {
    this.onEdit.emit(c);
  }

  deleteChapter(c: Chapter): void{
    this.onDelete.emit(c);
  }

  onRowSelectOrUnSelect(){
    this.onSelected.emit(this.selectedChapter);
  }

  onShowMathDesignBtn(c: Chapter){
    this.onShowMathDesign.emit(c);
  }

  onPaginate(event: any) {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Major } from 'src/app/@core/model/major.model';
import { Paging } from 'src/app/@core/model/paging.model';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-table-mathdesign',
  templateUrl: './table-mathdesign.component.html',
  styleUrls: ['./table-mathdesign.component.scss']
})
export class TableMathdesignComponent extends TablePagingFunction implements OnInit {

  @Input() mathdesigns!: MathDesign[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() totalRecordsDB!: number;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<MathDesign>();
  @Output() onDelete = new EventEmitter<MathDesign>();
  @Output() onSelected = new EventEmitter<MathDesign[]>();
  @Output() onShowChapter = new EventEmitter<MathDesign>();
  @Output() onPagingChange = new EventEmitter<Paging>();

  mathdesign!: MathDesign;

  selectedMathdesigns!: MathDesign[];

  majors!: Major[];

  major!: Major;

  isDynamic = false;

  constructor(public config: DynamicDialogConfig) { super(); }

  ngOnInit(): void {
    this.bindDataForDynamic();
  }

  bindDataForDynamic(): void {
    if(this.config.data) {
      this.isDynamic = true;
      this.mathdesigns = this.config.data.mathdesigns;
    }
  }

  editMathDesign(m: MathDesign): void {
    this.onEdit.emit(m);
  }

  deleteMathDesign(m: MathDesign): void{
    this.onDelete.emit(m);
  }

  onRowSelectOrUnSelect(): void {
    this.onSelected.emit(this.selectedMathdesigns);
  }

  onShowChapterBtn(m: MathDesign): void {
    console.log(m);
    this.onShowChapter.emit(m);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
}
}

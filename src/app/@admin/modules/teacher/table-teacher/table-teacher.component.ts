import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/@core/model/paging.model';
import { User } from 'src/app/@core/model/user.model';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';

@Component({
  selector: 'app-table-teacher',
  templateUrl: './table-teacher.component.html',
  styleUrls: ['./table-teacher.component.scss']
})
export class TableTeacherComponent extends TablePagingFunction implements OnInit {

  @Input() teachers!: User[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<User>();
  @Output() onDelete = new EventEmitter<User>();
  @Output() onSelected = new EventEmitter<User[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();
  @Output() onChangePassword = new EventEmitter<User>();

  teacher!: User;

  selectedTeachers!: User[];

  isDynamic = false;

  constructor(public config: DynamicDialogConfig) { super(); }

  ngOnInit(): void {
    if (this.config.data){
      this.isDynamic = true;
      this.teachers = this.config.data.teachers;
    }
  }

  onEditUser(u: User): void {
    this.onEdit.emit(u);
  }

  onDeleteUser(u: User): void {
    this.onDelete.emit(u);
  }

  onselectOrUnSelect(): void {
    this.onSelected.emit(this.selectedTeachers);
  }

  onPaginate(event: any): void {
    this.onPagingChange.emit({
      currentPage: event.page,
      size: event.rows
    });
  }

  onChangePass(u: User): void {
    this.onChangePassword.emit(u);
  }

}

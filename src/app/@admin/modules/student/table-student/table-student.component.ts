import { User } from 'src/app/@core/model/user.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TablePagingFunction } from 'src/app/@core/utils/PagingFunction';
import { Paging } from 'src/app/@core/model/paging.model';

@Component({
  selector: 'app-table-student',
  templateUrl: './table-student.component.html',
  styleUrls: ['./table-student.component.scss']
})
export class TableStudentComponent extends TablePagingFunction implements OnInit {

  @Input() students!: User[];
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() loading = false;

  @Output() onEdit = new EventEmitter<User>();
  @Output() onDelete = new EventEmitter<User>();
  @Output() onSelected = new EventEmitter<User[]>();
  @Output() onPagingChange = new EventEmitter<Paging>();
  @Output() onChangePassword = new EventEmitter<User>();


  student!: User;

  @Input() selectedStudents!: User[];

  isDynamic = false;

  constructor(public config: DynamicDialogConfig) { super(); }

  ngOnInit(): void {
    if (this.config.data){
      this.isDynamic = true;
      this.students = this.config.data.students;
    }
  }

  onEditUser(u: User): void {
    this.onEdit.emit(u);
  }

  onDeleteUser(u: User): void {
    this.onDelete.emit(u);
  }

  onselectOrUnSelect(): void {
    this.onSelected.emit(this.selectedStudents);
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

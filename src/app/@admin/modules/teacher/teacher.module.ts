import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherComponent } from './teacher.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import {PasswordModule} from 'primeng/password';
import {CalendarModule} from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { TableTeacherComponent } from './table-teacher/table-teacher.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    TeacherComponent,
    TableTeacherComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TeacherRoutingModule,
    RadioButtonModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    FormsModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    TableModule,
    AvatarModule,
    PasswordModule,
    CalendarModule,
    PanelModule,
    PaginatorModule,
    BadgeModule,
    TooltipModule
  ],
  exports: [
    TableTeacherComponent
  ],
  providers: [
    {
      provide: DynamicDialogConfig
      , useValue: {}
    },
  ]
})
export class TeacherModule { }

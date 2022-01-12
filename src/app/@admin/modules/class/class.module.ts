import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { StudentModule } from './../student/student.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassRoutingModule } from './class-routing.module';
import { ClassComponent } from './class.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ClassDetailComponent } from './class-detail/class-detail.component';
import {PanelModule} from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import {DynamicDialogConfig, DynamicDialogModule} from 'primeng/dynamicdialog';
import { TableClassComponent } from './table-class/table-class.component';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';


@NgModule({
  declarations: [
    ClassComponent,
    ClassDetailComponent,
    TableClassComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClassRoutingModule,
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
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    TableModule,
    PanelModule,
    DynamicDialogModule,
    AvatarModule,
    PaginatorModule,
    BadgeModule,
    StudentModule,
    CalendarModule,
    PasswordModule
  ],
  providers: [
    {
      provide: DynamicDialogConfig
      , useValue: {}
    },
  ],
  exports: [
    TableClassComponent
  ],
  entryComponents: [
    TableClassComponent
  ]
})
export class ClassModule { }

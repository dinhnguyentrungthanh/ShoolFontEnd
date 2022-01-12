import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChapterRoutingModule } from './chapter-routing.module';
import { ChapterComponent } from './chapter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TableChapterComponent } from './table-chapter/table-chapter.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';


@NgModule({
  declarations: [
    ChapterComponent,
    TableChapterComponent
  ],
  imports: [
    CommonModule,
    ChapterRoutingModule,
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
    PanelModule,
    ReactiveFormsModule,
    PaginatorModule,
    BadgeModule
  ],
  providers: [
    {
      provide: DynamicDialogConfig
      , useValue: {}
    },
  ],
})
export class ChapterModule { }

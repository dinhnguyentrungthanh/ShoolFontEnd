
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReviewQuestionComponent } from './review-question.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';
import {InputNumberModule} from 'primeng/inputnumber';


import { PipeModule } from 'src/app/@core/pipes/pipe.module';
import { TableReviewQuestionComponent } from './table-review-question/table-review-question.component';

@NgModule({
  declarations: [
    ReviewQuestionComponent,
    TableReviewQuestionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    TableModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    FormsModule,
    PanelModule,
    DropdownModule,
    PanelModule,
    ButtonModule,
    PaginatorModule,
    BadgeModule,
    DropdownModule,
    CardModule,
    CKEditorModule,
    ConfirmDialogModule,
    PanelModule,
    PipeModule,
    InputNumberModule
  ],
  exports: [
    ReviewQuestionComponent,
    TableReviewQuestionComponent
  ],
  entryComponents: [
    ReviewQuestionComponent
  ]
})
export class ReviewquestionModule { }

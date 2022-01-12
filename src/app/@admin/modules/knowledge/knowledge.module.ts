import { ReviewquestionModule } from '../review-question/review-question.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CardModule } from 'primeng/card';
import { EditKnowledgeComponent } from './edit-knowledge/edit-knowledge.component';
import { BadgeModule } from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeRoutingModule } from './knowledge-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

import { KnowledgeComponent } from './knowledge.component';
import { CreateKnowledgeComponent } from './create-knowledge/create-knowledge.component';
import { TableKnowledgeComponent } from './table-knowledge/table-knowledge.component';
import { PipeModule } from 'src/app/@core/pipes/pipe.module';

@NgModule({
  declarations: [
    KnowledgeComponent,
    EditKnowledgeComponent,
    CreateKnowledgeComponent,
    TableKnowledgeComponent,
  ],
  imports: [
    CommonModule,
    MultiSelectModule,
    TableModule,
    KnowledgeRoutingModule,
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
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    ReviewquestionModule,
    PipeModule,
  ],
  exports: [
    TableKnowledgeComponent
  ]
})
export class KnowledgeModule { }

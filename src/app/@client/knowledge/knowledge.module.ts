import { PanelModule } from 'primeng/panel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';

import { KnowledgeComponent } from './knowledge.component';
import { KnowledgeRoutingModule } from './knowledge-routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PipeModule } from 'src/app/@core/pipes/pipe.module';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CountdownModule } from 'ngx-countdown';
import { SplitterModule } from 'primeng/splitter';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { ReviewquestionModule } from '../reviewquestion/reviewquestion.module';

@NgModule({
  declarations: [
   KnowledgeComponent
  ],
  imports: [
    CommonModule,
    KnowledgeRoutingModule,
    FieldsetModule,
    DropdownModule,
    CKEditorModule,
    PipeModule,
    BadgeModule,
    ButtonModule,
    PanelModule,
    PipeModule,
    CountdownModule,
    SplitterModule,
    PaginatorModule,
    TabViewModule,
    InputTextareaModule,
    ButtonModule,
    ReviewquestionModule
  ]
})
export class KnowledgeModule { }

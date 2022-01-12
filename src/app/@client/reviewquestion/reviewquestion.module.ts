import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewquestionRoutingModule } from './reviewquestion-routing.module';
import { ReviewquestionComponent } from './reviewquestion.component';
import { CountdownModule } from 'ngx-countdown';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  declarations: [
    ReviewquestionComponent
  ],
  imports: [
    CommonModule,
    ReviewquestionRoutingModule,
    SplitterModule,
    BadgeModule,
    PaginatorModule,
    TabViewModule,
    InputTextareaModule,
    ButtonModule,
    CountdownModule,
  ],
  exports: [
    ReviewquestionComponent
  ]
})
export class ReviewquestionModule { }

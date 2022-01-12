import { PipeModule } from 'src/app/@core/pipes/pipe.module';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTestRoutingModule } from './my-test-routing.module';
import { MyTestComponent } from './my-test.component';
import { MyTestDetailComponent } from './my-test-detail/my-test-detail.component';


@NgModule({
  declarations: [
    MyTestComponent,
    MyTestDetailComponent
  ],
  imports: [
    CommonModule,
    MyTestRoutingModule,
    PanelModule,
    TableModule,
    PaginatorModule,
    BadgeModule,
    PipeModule
  ]
})
export class MyTestModule { }

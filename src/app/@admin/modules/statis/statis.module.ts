import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisRoutingModule } from './statis-routing.module';
import { StatisComponent } from './statis.component';


@NgModule({
  declarations: [
    StatisComponent
  ],
  imports: [
    CommonModule,
    StatisRoutingModule
  ]
})
export class StatisModule { }

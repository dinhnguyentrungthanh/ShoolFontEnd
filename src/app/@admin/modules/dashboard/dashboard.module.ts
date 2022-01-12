import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dasboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {KnobModule} from 'primeng/knob';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    KnobModule,
    FormsModule,
    PanelModule,
    ProgressSpinnerModule
  ]
})
export class DashboardModule { }

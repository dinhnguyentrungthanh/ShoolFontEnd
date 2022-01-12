import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathdesignRoutingModule } from './mathdesign-routing.module';
import { MathdesignComponent } from './mathdesign.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';


@NgModule({
  declarations: [
    MathdesignComponent
  ],
  imports: [
    CommonModule,
    MathdesignRoutingModule,
    FormsModule,
    TreeModule,
    ToastModule,
    ButtonModule,
    PanelModule,
  ]
})
export class MathdesignModule { }

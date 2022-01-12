import { BadgeModule } from 'primeng/badge';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathdesignRoutingModule } from './mathdesign-routing.module';
import { MathdesignComponent } from './mathdesign.component';
import { TableModule } from 'primeng/table';
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
import { TableMathdesignComponent } from './table-mathdesign/table-mathdesign.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import {PaginatorModule} from 'primeng/paginator';


@NgModule({
  declarations: [
    MathdesignComponent,
    TableMathdesignComponent
  ],
  imports: [
    CommonModule,
    MathdesignRoutingModule,
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
    ReactiveFormsModule,
    PanelModule,
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
export class MathdesignModule { }

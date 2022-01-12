import { BadgeModule } from 'primeng/badge';
import { PipeModule } from './../../../@core/pipes/pipe.module';
import { TestTypeRoutingModule } from './test-type-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import {TooltipModule} from 'primeng/tooltip';

import { TestTypeComponent } from './test-type.component';
import { TableTestTypeComponent } from './table-test-type/table-test-type.component';
import { TestTypeDetailComponent } from './test-type-detail/test-type-detail.component';
import { TestModule } from '../test/test.module';


@NgModule({
  declarations: [
    TestTypeComponent,
    TableTestTypeComponent,
    TestTypeDetailComponent,
  ],
  imports: [
    CommonModule,
    TestTypeRoutingModule,
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
    PipeModule,
    BadgeModule,
    TooltipModule,
    TestModule
  ],
  exports: [
    TableTestTypeComponent
  ]
})
export class TestTypeModule { }

import { TestRoutingModule } from './test-routing.module';
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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PipeModule } from 'src/app/@core/pipes/pipe.module';
import { TestComponent } from './test.component';
import { TableTestComponent } from './table-test/table-test.component';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [
    TestComponent,
    TableTestComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
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
    CKEditorModule,
    TooltipModule,
    BadgeModule
  ],
  exports: [
    TestComponent,
    TableTestComponent
  ]
})
export class TestModule { }

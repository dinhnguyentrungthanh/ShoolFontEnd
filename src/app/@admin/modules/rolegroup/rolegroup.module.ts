import { BadgeModule } from 'primeng/badge';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolegroupRoutingModule } from './rolegroup-routing.module';
import { RolegroupComponent } from './rolegroup.component';
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
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {CheckboxModule} from 'primeng/checkbox';
import {ListboxModule} from 'primeng/listbox';
import { AddPermissionComponent } from './add-permission/add-permission.component';


@NgModule({
  declarations: [
    RolegroupComponent,
    AddPermissionComponent
  ],
  imports: [
    CommonModule,
    RolegroupRoutingModule,
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
    FormsModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    TableModule,
    ReactiveFormsModule,
    PanelModule,
    PaginatorModule,
    CheckboxModule,
    ListboxModule,
    BadgeModule
  ],
  providers: [
    {
      provide: DynamicDialogConfig
      , useValue: {}
    },
  ],
})
export class RolegroupModule { }

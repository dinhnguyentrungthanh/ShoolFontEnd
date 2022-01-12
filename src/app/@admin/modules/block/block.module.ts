import { MajorModule } from './../major/major.module';
import { ClassModule } from './../class/class.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';

import { BlockRoutingModule } from './block-routing.module';
import { BlockComponent } from './block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockDetailComponent } from './block-detail/block-detail.component';
import { PanelModule } from 'primeng/panel';
import { TableBlockComponent } from './table-block/table-block.component';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  declarations: [
    BlockComponent,
    BlockDetailComponent,
    TableBlockComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BlockRoutingModule,
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
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    TableModule,
    PanelModule,
    DynamicDialogModule,
    ClassModule,
    PaginatorModule,
    BadgeModule,
    TooltipModule,
    MajorModule
  ]
})
export class BlockModule { }

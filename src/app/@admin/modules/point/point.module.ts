import { PipeModule } from './../../../@core/pipes/pipe.module';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { PointRoutingModule } from './point-routing.module';
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
import { PointComponent } from './point.component';
import { TablePointMultiChoiceComponent } from './table-point-multi-choice/table-point-multi-choice.component';
import { TablePointEssayComponent } from './table-point-essay/table-point-essay.component';
import { PointEssayDetailComponent } from './point-essay-detail/point-essay-detail.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PointMultiChoiceDetailComponent } from './point-multi-choice-detail/point-multi-choice-detail.component';


@NgModule({
  declarations: [
    PointComponent,
    TablePointMultiChoiceComponent,
    TablePointEssayComponent,
    PointEssayDetailComponent,
    PointMultiChoiceDetailComponent,
  ],
  imports: [
    CommonModule,
    PointRoutingModule,
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
    TooltipModule,
    BadgeModule,
    AvatarModule,
    PipeModule,
    ProgressSpinnerModule
  ]
})
export class PointModule { }

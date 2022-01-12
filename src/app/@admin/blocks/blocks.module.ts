import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { SidebarComponent } from './sidebar/sidebar.component';
import { MenubarComponent } from './menubar/menubar.component';
import { SidebarRightComponent } from './sidebar-right/sidebar-right.component';
import { BlocksComponent } from './blocks.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    SidebarComponent,
    MenubarComponent,
    SidebarRightComponent,
    BlocksComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    MegaMenuModule,
    RippleModule,
    ButtonModule,
    BadgeModule,
    AvatarModule,
    OverlayPanelModule,
    SidebarModule,
    BreadcrumbModule,
    ScrollPanelModule,
    FormsModule,
    MultiSelectModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    DialogModule,
    DropdownModule
  ],
  exports: [
    SidebarComponent,
    MenubarComponent,
    SidebarRightComponent,
    BlocksComponent,
    BreadcrumbComponent
  ]
})
export class BlocksModule { }

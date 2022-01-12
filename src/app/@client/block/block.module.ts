import { AvatarModule } from 'primeng/avatar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockRoutingModule } from './block-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BlockComponent } from './block.component';
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BlockComponent
  ],
  imports: [
    CommonModule,
    BlockRoutingModule,
    ButtonModule,
    MenubarModule,
    BadgeModule,
    MessageModule,
    MessagesModule,
    AvatarModule,
    DialogModule,
    ToastModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ]
})
export class BlockModule { }

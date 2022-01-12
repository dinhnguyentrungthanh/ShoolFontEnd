import { NotifyService } from 'src/app/@core/service/notify.service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './@core/service/auth.service';
import { TokenInterceptor } from './@core/config/token.interceptor';
import { StorageService } from './@core/service/storage.service';
import { UserService } from './@core/service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LayoutComponent } from './@admin/layouts/layout/layout.component';
import { BlocksModule } from './@admin/blocks/blocks.module';
import { ErrorModule } from './@admin/modules/error/error.module';
import { BlockModule } from './@client/block/block.module';
import { TreeModule } from 'primeng/tree';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { PipeModule } from './@core/pipes/pipe.module';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';
import { TestComponent } from './client/test/test.component';

export function tokenGetter(): any {
  return localStorage.getItem('JWT_TOKEN');
}
function countdownConfigFactory(): CountdownGlobalConfig {
  const cd = new CountdownGlobalConfig('en');
  cd.format = `mm:ss`;
  return cd;
}
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TestComponent
  ],
  providers: [
    HttpClient,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    StorageService,
    UserService,
    ConfirmationService,
    MessageService,
    DialogService,
    NotifyService,
    { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory }
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BlocksModule,
    TreeModule,
    BlockModule,
    ErrorModule,
    SplitterModule,
    FieldsetModule,
    TabViewModule,
    PaginatorModule,
    ButtonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    AkitaNgDevtools.forRoot(),
    PipeModule,
    CountdownModule
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

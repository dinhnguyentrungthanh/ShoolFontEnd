import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorAccessDeniedComponent } from './error-access-denied/error-access-denied.component';
import { ErrorNotFoundComponent } from './error-not-found/error-not-found.component';


@NgModule({
  declarations: [
    ErrorAccessDeniedComponent,
    ErrorNotFoundComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }

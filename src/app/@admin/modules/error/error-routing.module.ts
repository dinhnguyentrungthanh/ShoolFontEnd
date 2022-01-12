import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorAccessDeniedComponent } from './error-access-denied/error-access-denied.component';
import { ErrorNotFoundComponent } from './error-not-found/error-not-found.component';

const routes: Routes = [
  {
    path: 'not-found',
    component: ErrorNotFoundComponent
  },
  {
    path: 'access-denied',
    component: ErrorAccessDeniedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }

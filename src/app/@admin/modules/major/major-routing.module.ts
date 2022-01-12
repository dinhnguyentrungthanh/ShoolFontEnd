import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MajorComponent } from './major.component';

const routes: Routes = [
  {
    path: '',
    component: MajorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MajorRoutingModule { }

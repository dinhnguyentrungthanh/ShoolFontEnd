import { TestTypeDetailComponent } from './test-type-detail/test-type-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestTypeComponent } from './test-type.component';

const routes: Routes = [
  {
    path: '',
    component: TestTypeComponent
  },
  {
    path: ':id',
    component: TestTypeDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestTypeRoutingModule { }

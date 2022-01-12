import { ChekingTestGuard } from './../../@core/guard/cheking-test.guard';
import { MyTestDetailComponent } from './my-test-detail/my-test-detail.component';
import { MyTestComponent } from './my-test.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MyTestComponent
  },
  {
    path: ':id',
    component: MyTestDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTestRoutingModule { }

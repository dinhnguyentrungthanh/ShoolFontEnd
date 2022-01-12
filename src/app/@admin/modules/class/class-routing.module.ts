import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassDetailComponent } from './class-detail/class-detail.component';
import { ClassComponent } from './class.component';

const routes: Routes = [
  {
    path: '',
    component: ClassComponent
  },
  {
    path: ':id',
    component: ClassDetailComponent,
    data: {
      breadcrumb: 'Chi Tiết Lớp'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockDetailComponent } from './block-detail/block-detail.component';
import { BlockComponent } from './block.component';

const routes: Routes = [
  {
    path: '',
    component: BlockComponent
  },
  {
    path: ':id',
    component: BlockDetailComponent,
    data: {
      breadcrumb: 'Chi Tiết Khối'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockRoutingModule { }

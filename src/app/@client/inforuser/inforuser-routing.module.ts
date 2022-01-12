import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InforuserComponent } from './inforuser.component';

const routes: Routes = [
  {
    path:'information',
    component: InforuserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InforuserRoutingModule { }

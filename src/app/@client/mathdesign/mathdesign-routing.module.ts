import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MathdesignComponent } from './mathdesign.component';

const routes: Routes = [
  {
    path:':blockSeo/:majorSeo/:mathDesignSeo',
    component:MathdesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MathdesignRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MathdesignComponent } from './mathdesign.component';

const routes: Routes = [
  {
  path: '',
  component: MathdesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MathdesignRoutingModule { }

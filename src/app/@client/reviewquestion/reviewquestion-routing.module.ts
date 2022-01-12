import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewquestionComponent } from './reviewquestion.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewquestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewquestionRoutingModule { }

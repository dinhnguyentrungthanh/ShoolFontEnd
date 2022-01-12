import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeComponent } from './knowledge.component';

const routes: Routes = [
  {
    path:':blockSeo/:majorSeo/:mathDesignSeo/:chapterSeo/:knowledgeSeo',
    component: KnowledgeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowledgeRoutingModule { }

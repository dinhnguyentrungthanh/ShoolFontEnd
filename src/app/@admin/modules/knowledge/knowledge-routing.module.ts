import { CreateKnowledgeComponent } from './create-knowledge/create-knowledge.component';
import { EditKnowledgeComponent } from './edit-knowledge/edit-knowledge.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeComponent } from './knowledge.component';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeComponent,
  },
  {
    path: 'edit/:id',
    data: {
      breadcrumb: 'Lưu kiến thức'
    },
    component: EditKnowledgeComponent
  },
  {
    path: 'create',
    data: {
      breadcrumb: 'Tạo kiến thức'
    },
    component: CreateKnowledgeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class KnowledgeRoutingModule { }

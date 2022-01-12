import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinigameComponent } from '../minigame/minigame.component';
import { ReviewquestionComponent } from '../reviewquestion/reviewquestion.component';
import { IndexComponent } from './index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'minigame',
    component:MinigameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }

import { PointMultiChoiceDetailComponent } from './point-multi-choice-detail/point-multi-choice-detail.component';
import { PointEssayDetailComponent } from './point-essay-detail/point-essay-detail.component';
import { TablePointEssayComponent } from './table-point-essay/table-point-essay.component';
import { TablePointMultiChoiceComponent } from './table-point-multi-choice/table-point-multi-choice.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointComponent } from './point.component';

const routes: Routes = [
  {
    path: '',
    component: PointComponent,
    children: [
      {
        path: 'multi-choice',
        component: TablePointMultiChoiceComponent,
        data: {
          breadcrumb: 'Trắc Nghiệm',
        },
      },
      {
        path: 'essay',
        component: TablePointEssayComponent,
        data: {
          breadcrumb: 'Tự Luận',
        },
      }
    ],
  },
  {
    path: 'essay/:id',
    component: PointEssayDetailComponent,
    data: {
      breadcrumb: 'Chi Tiết',
    },
  },
  {
    path: 'multi-choice/:id',
    component: PointMultiChoiceDetailComponent,
    data: {
      breadcrumb: 'Chi Tiết',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointRoutingModule {}

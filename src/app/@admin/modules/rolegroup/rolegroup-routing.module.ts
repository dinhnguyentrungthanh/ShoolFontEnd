import { AddPermissionComponent } from './add-permission/add-permission.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolegroupComponent } from './rolegroup.component';

const routes: Routes = [
  {
    path: 'list',
    component: RolegroupComponent
  },
  {
    path: 'permission',
    component: AddPermissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolegroupRoutingModule { }

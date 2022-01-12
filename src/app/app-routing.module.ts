import { ChekingTestGuard } from './@core/guard/cheking-test.guard';
import { TestRoutingModule } from './@admin/modules/test/test-routing.module';
import { MinigameComponent } from './@client/minigame/minigame.component';
import { ERole } from './@core/model/user.model';
import { ELevel } from 'src/app/@core/model/user.model';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { BlocksComponent } from './@admin/blocks/blocks.component';
import { LayoutComponent } from './@admin/layouts/layout/layout.component';
import { AuthGuard } from './@core/guard/auth.guard';
import { ErrorNotFoundComponent } from './@admin/modules/error/error-not-found/error-not-found.component';
import { LevelGuard } from './@core/guard/level.guard';
import { LoggedInGuard } from './@core/guard/logged-in.guard';

import { BlockComponent } from './@client/block/block.component';
import { ChatComponent } from './@chat/chat/chat.component';
import { StudentGuard } from './@core/guard/student.guard';
import { AnonymousGuard } from './@core/guard/anonymous.guard';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./@chat/chat/chat-routing.module').then(m => m.ChatRoutingModule)
      }
    ]
  },
  {
    path: 'minigame',
    canActivate: [AnonymousGuard, ChekingTestGuard],
    loadChildren: () => import('./@client/minigame/minigame.module').then(m => m.MinigameModule)
  },
  {
    path: '',
    component: BlockComponent,
    children: [
      {
        path: '',
        canActivate: [AnonymousGuard, ChekingTestGuard],
        loadChildren: () => import('./@client/index/index.module').then(m => m.IndexModule)
      },
      {
        path: '',
        canActivate: [AnonymousGuard],
        loadChildren: () => import('./@client/auth-user/auth-user.module').then(m => m.AuthUserModule)
      },
      {
        path: '',
        canActivate: [StudentGuard, ChekingTestGuard],
        loadChildren: () => import('./@client/inforuser/inforuser.module').then(m => m.InforuserModule)
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'admin',
        component: LayoutComponent,
        canActivate: [LoggedInGuard],
        loadChildren: () => import('./@admin/modules/auth/auth.module').then(m => m.AuthModule),
      },
      {
        path: 'admin',
        component: BlocksComponent,
        children: [
          {
            path: 'dashboard',
            data: {
              breadcrumb: 'Tổng quan',
              allowedLevel: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
          },
          {
            path: 'teacher',
            data: {
              breadcrumb: 'Giáo viên',
              allowedRoles: [ERole.ROLE_USER_VIEW, ERole.ROLE_USER_CREATE, ERole.ROLE_USER_DELETE, ERole.ROLE_USER_UPDATE],
              allowedLevel: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/teacher/teacher.module').then(m => m.TeacherModule)
          },
          {
            path: 'student',
            data: {
              breadcrumb: 'Học viên',
              allowedRoles: [ERole.ROLE_USER_VIEW, ERole.ROLE_USER_CREATE, ERole.ROLE_USER_DELETE, ERole.ROLE_USER_UPDATE],
              allowedLevel: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/student/student.module').then(m => m.StudentModule)
          },
          {
            path: 'block',
            data: {
              breadcrumb: 'Khối',
              allowedRoles: [ERole.ROLE_BLOCK_VIEW, ERole.ROLE_BLOCK_CREATE, ERole.ROLE_BLOCK_DELETE, ERole.ROLE_BLOCK_UPDATE],
              allowedLevel: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/block/block.module').then(m => m.BlockModule)
          },
          {
            path: 'knowledge',
            data: {
              breadcrumb: 'Kiến thức',
              allowedRoles: [ERole.ROLE_KNOWLEGDE_VIEW, ERole.ROLE_KNOWLEGDE_CREATE, ERole.ROLE_KNOWLEGDE_DELETE, ERole.ROLE_KNOWLEGDE_UPDATE],
              allowedLevel: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/knowledge/knowledge.module').then(m => m.KnowledgeModule)
          },
          {
            path: 'class',
            data: {
              breadcrumb: 'Lớp',
              allowedRoles: [ERole.ROLE_CLASS_VIEW, ERole.ROLE_CLASS_CREATE, ERole.ROLE_CLASS_DELETE, ERole.ROLE_CLASS_UPDATE],
              allowedLevel: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR,ELevel.TEACHER]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/class/class.module').then(m => m.ClassModule)
          },
          {
            path: 'major',
            data: {
              breadcrumb: 'Môn',
              allowedRoles: [ERole.ROLE_MAJOR_VIEW, ERole.ROLE_MAJOR_CREATE, ERole.ROLE_MAJOR_DELETE, ERole.ROLE_MAJOR_UPDATE],
              allowedLevel: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/major/major.module').then(m => m.MajorModule)
          },
          {
            path: 'mathdesign',
            data: {
              breadcrumb: 'Dạng Toán',
              allowedRoles: [ERole.ROLE_MATHDESIGN_VIEW, ERole.ROLE_MATHDESIGN_CREATE, ERole.ROLE_MATHDESIGN_DELETE, ERole.ROLE_MATHDESIGN_UPDATE],
              allowedLevel: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/mathdesign/mathdesign.module').then(m => m.MathdesignModule)
          },
          {
            path: 'test_type',
            data: {
              breadcrumb: 'Bài kiểm tra',
              allowedRoles: [ERole.ROLE_TEST_TYPE_VIEW, ERole.ROLE_TEST_TYPE_CREATE, ERole.ROLE_TEST_TYPE_DELETE, ERole.ROLE_TEST_TYPE_UPDATE],
              allowedLevel: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/testType/test-type.module').then(m => m.TestTypeModule)
          },
          {
            path: 'point',
            data: {
              breadcrumb: 'Danh sách bài kiểm tra',
              allowedRoles: [ERole.ROLE_POINT_VIEW, ERole.ROLE_POINT_CREATE, ERole.ROLE_POINT_DELETE, ERole.ROLE_POINT_UPDATE],
              allowedLevel: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/point/point.module').then(m => m.PointModule)
          },
          {
            path: 'chapter',
            data: {
              breadcrumb: 'Chương',
              allowedRoles: [ERole.ROLE_CHAPTER_VIEW, ERole.ROLE_CHAPTER_CREATE, ERole.ROLE_CHAPTER_DELETE, ERole.ROLE_CHAPTER_UPDATE],
              allowedLevel: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR,ELevel.TEACHER]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/chapter/chapter.module').then(m => m.ChapterModule)
          },
          {
            path: 'rolegroup',
            data: {
              breadcrumb: 'Phân Quyền',
              allowedRoles: [ERole.ROLE_ROLEGROUP_VIEW, ERole.ROLE_ROLEGROUP_CREATE, ERole.ROLE_ROLEGROUP_DELETE, ERole.ROLE_ROLEGROUP_UPDATE],
              allowedLevel: [ELevel.ADMINISTRATOR]
            },
            canActivate: [AuthGuard, LevelGuard],
            loadChildren: () => import('./@admin/modules/rolegroup/rolegroup.module').then(m => m.RolegroupModule)
          },
        ]
      },
    ]
  },
  {
    path: '',
    component: BlockComponent,
    children: [
      {
        path: 'kiem-tra',
        canActivate: [AnonymousGuard],
        loadChildren: () => import('./@client/test/test.module').then(m => m.TestModule)
      },
      {
        path: 'my-test',
        canActivate: [StudentGuard, ChekingTestGuard],
        loadChildren: () => import('./@client/my-test/my-test.module').then(m => m.MyTestModule)
      },
      {
        path: 'kien-thuc',
        canActivate: [AnonymousGuard],
        canActivateChild: [ChekingTestGuard],
        loadChildren: () => import('./@client/mathdesign/mathdesign.module').then(m => m.MathdesignModule)
      },
      {
        path: 'kien-thuc',
        canActivate: [StudentGuard],
        canActivateChild: [ChekingTestGuard],
        loadChildren: () => import('./@client/knowledge/knowledge.module').then(m => m.KnowledgeModule)
      },
    ]
  },
  {
    path: '',
    loadChildren: () => import('./@admin/modules/error/error.module').then(m => m.ErrorModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    component: ErrorNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

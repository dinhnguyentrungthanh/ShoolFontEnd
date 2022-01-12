import { ELevel } from 'src/app/@core/model/user.model';

export interface Menu {
  parent?: string;
  items?: MenuItem[];
  levels: ELevel[];
}

export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  levels: ELevel[];
}

export const menu = [
  {
    parent: 'Trang chủ',
    levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR],
    items: [
      { label: 'Tổng quan', icon: 'pi pi-chart-line', path: '/admin/dashboard' }
    ]
  },
  {
    parent: 'Người dùng',
    levels: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR],
    items: [
      { label: 'Giáo Viên', icon: 'pi pi-user', path: '/admin/teacher', levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR] },
      { label: 'Học Viên', icon: 'pi pi-users', path: '/admin/student' },
    ]
  },
  {
    parent: 'Hệ Thống Học Tập',
    levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR,ELevel.TEACHER],
    items: [
      { label: 'Khối', icon: 'pi pi-th-large', path: '/admin/block',levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]},
      { label: 'Lớp', icon: ' pi pi-table', path: '/admin/class'},
      { label: 'Môn', icon: 'pi pi-desktop', path: '/admin/major' ,levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]},
      { label: 'Phân Môn', icon: 'pi pi-sitemap', path: '/admin/mathdesign' ,levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR]},
      { label: 'Chương', icon: 'pi pi-sort-down', path: '/admin/chapter' },
    ]
  },
  {
    parent: 'Bài Kiểm Tra',
    levels: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR],
    items: [
      { label: 'Tổng Hợp', icon: 'pi pi-list', path: '/admin/test_type' }
    ]
  },
  {
    parent: 'Quản Lý Điểm',
    levels: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR],
    items: [
      { label: 'Trắc Nghiệm', icon: 'pi pi-check-circle', path: '/admin/point/multi-choice' },
      { label: 'Tự Luận', icon: 'pi pi-pencil', path: '/admin/point/essay' },
    ]
  },
  {
    parent: 'Kiến Thức',
    levels: [ELevel.TEACHER, ELevel.DIRECTOR, ELevel.ADMINISTRATOR],
    items: [
      { label: 'Toán Học', icon: 'pi pi-sitemap', path: '/admin/knowledge' },
    ]
  },
  {
    parent: 'Phân Quyền',
    levels: [ELevel.DIRECTOR, ELevel.ADMINISTRATOR],
    items: [
      { label: 'Nhóm Người Dùng', icon: 'pi pi-lock', path: '/admin/rolegroup/list' },
      { label: 'Người Dùng', icon: 'pi pi-shield', path: '/admin/rolegroup/permission' },
    ]
  },
];

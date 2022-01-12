import { AuthService } from './../../../@core/service/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  @Input() expandMenu!: boolean;
  @Input() displaySiderbarRight!: boolean;
  @Input() displayMenuMobile!: boolean;
  @Output() onToggleMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onToggleSiderbarRight: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onLogout: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public authService: AuthService
  ) { }

  items!: MegaMenuItem[];
  items1!: MenuItem[];
  display!: boolean;

  ngOnInit(): void {
    this.items1 = [
      // {
      //   label: 'Cài đặt',
      //   items: [{
      //     label: 'Thông báo',
      //     icon: 'pi pi-bell',
      //     command: () => {}
      //   },
      //   {
      //     label: 'Cá nhân',
      //     icon: 'pi pi-user-edit',
      //     command: () => {}
      //   }
      // ]},
      {
        label: 'Hành động',
        items: [{
          label: 'Đăng Xuất',
          icon: 'pi pi-power-off',
          command: () => {
            this.logout();
          }
        }]
      }];
  }

  toggleOpenCloseMenu(): void {
    this.expandMenu = !this.expandMenu;
    this.onToggleMenu.emit(this.expandMenu);
  }

  toggleSiderbarRight(): void {
    this.displaySiderbarRight = !this.displaySiderbarRight;
    this.onToggleSiderbarRight.emit(this.displaySiderbarRight);
  }

  toggleDisplayMenubarMobile(): void {
    this.displayMenuMobile = !this.displayMenuMobile;
  }

  logout(): void {
    this.onLogout.emit(true);
  }

}

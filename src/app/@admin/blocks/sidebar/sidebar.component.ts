import { ELevel } from 'src/app/@core/model/user.model';
import { AuthService } from 'src/app/@core/service/auth.service';
import { Component, OnInit } from '@angular/core';

import { menu } from 'src/app/@core/config/sidebar.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private _authService: AuthService
  ) { }

  items = menu;

  level: ELevel = this._authService.getLevel();

  ngOnInit(): void {
  }

}

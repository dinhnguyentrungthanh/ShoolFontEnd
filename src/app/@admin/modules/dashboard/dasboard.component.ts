import { Component, OnInit } from '@angular/core';
import { pipe, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ELevel, User } from 'src/app/@core/model/user.model';
import { AuthService } from 'src/app/@core/service/auth.service';
import { UserService } from 'src/app/@core/service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  users$!: Observable<User[]>;

  users!: User[];

  user!: User;

  constructor(
    private _userService: UserService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  private fetchAllData(): void {
    this.users$ = this._userService.findAllNotPaging(ELevel.STUDENT).pipe(
      take(1),
      tap((data: User[]) => {
        this.users = data;
      })
    );
  }
}

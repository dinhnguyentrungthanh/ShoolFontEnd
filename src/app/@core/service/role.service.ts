import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConstraint } from '../common/api.constraint';
import { Role } from '../model/role.model';
import { IBaseService } from './ibase.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends IBaseService{

  constructor(
    private _http: HttpClient,
    private _notifyService: NotifyService,
  ) {
    super();
  }

  findAllNotPaging(): Observable<Role[]>{
    return this._http.get<Role[]>(this.sendToNotUsingPaging(ApiConstraint.ROLE));
  }

  findById(id: string): Observable<Role>{
    return this._http.get<any>(this.sendTo(`${ApiConstraint.ROLE}/${id}`))
        .pipe(
          map(res => res as Role)
        );
  }
}

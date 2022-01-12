import { ApiConstraint } from './../common/api.constraint';
import { Observable, of } from 'rxjs';
import { IBaseService } from './ibase.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StringUtils } from '../utils/string.util';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService extends IBaseService {

  constructor(
    private _http: HttpClient
  ) {super(); }

    uploadAvatar(userId: string | undefined, event: any): Observable<any> {
        const file: File = event.target.files[0];

        if (file) {
          const formData = new FormData();
          formData.append('avatar', file);

          return  this._http.post(this.sendTo(StringUtils.format(ApiConstraint.UPLOAD_FILE_AVATAR, userId)), formData, {
                reportProgress: true,
                observe: 'events',
                responseType: 'json',
            });
        }
        return of(null);
    }
}

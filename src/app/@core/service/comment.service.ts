import { ApiConstraint } from '../common/api.constraint';
import { AppModule } from '../../app.module';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IBaseService } from './ibase.service';
import { Chapter } from '../model/base.chapter';
import { Knowledge } from '../model/knowledge.model';

@Injectable({ providedIn: 'root' })
export class CommentService extends IBaseService {

    path = 'comment';

    constructor(private http: HttpClient) {
        super();
    }

    getList(param: string): Observable<any> {
        let uri = this.path;

        if (param.trim().length > 0) {
            uri += param;
        }

        return this.http.get(this.sendTo(uri));
    }

    insert(comment: object): Observable<object> {
        return this.http.post(this.sendTo(this.path), comment);
    }

}

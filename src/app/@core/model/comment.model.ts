import { BaseModel } from './base.model';

export class Comment extends BaseModel {
    id?: string;
    content?: string;
    username?: string;
    testId?: string;
    parentId?: string;
}

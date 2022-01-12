import { BaseModel } from './base.model';
import { Block } from './block.model';
import { User } from './user.model';

export class Class extends BaseModel {

    classname?: string;
    block?: Block | string;
    users?: Array<User> | Array<string>;

}

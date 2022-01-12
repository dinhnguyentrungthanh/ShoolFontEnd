import { BaseModel } from './base.model';
import { Role } from './role.model';

export class Rolegroup extends BaseModel {

    name?: string;
    roles?: Array<Role> | Array<string>;
}

import { Class } from './base.class';
import { BaseModel } from './base.model';
import { Major } from './major.model';

export class Block extends BaseModel{
    blockname?: string;
    url?: string;
    majors?: Array<Major> | Array<string>;
    classes?: Array<Class> | Array<string>;
}

import { Chapter } from './base.chapter';
import { BaseModel } from './base.model';
import { Block } from './block.model';
import { Major } from './major.model';

export class MathDesign extends BaseModel {

    mathDesignName?: string;
    url?: string;
    major?: string | Major;
    chapters?: Array<Chapter> | Array<string>;

}

import { Knowledge } from './knowledge.model';
import { MathDesign } from './base.mathDesign';
import { BaseModel } from './base.model';
import { Block } from './block.model';

export class Chapter extends BaseModel {

    chaptername?: string;
    block?: string | Block;
    url?: string;
    mathDesign?: string | MathDesign;
    knowledges?: Array<Knowledge> | Array<string>;

}

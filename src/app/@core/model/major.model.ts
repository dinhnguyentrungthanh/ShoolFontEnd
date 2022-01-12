import { MathDesign } from './base.mathDesign';
import { BaseModel } from './base.model';
import { Block } from './block.model';

export class Major extends BaseModel{

    majorname?: string;
    url?: string;
    block?: string | Block;
    mathDesigns?: Array<MathDesign> | Array<string>;
}

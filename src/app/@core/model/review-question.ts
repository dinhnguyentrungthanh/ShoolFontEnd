import { BaseModel } from './base.model';
export class ReviewQuestion extends BaseModel{

    reviewQuestionName?: string;
    reviewQuestionAnswer?: string;
    time?: number;
    knowledge?: string;
}

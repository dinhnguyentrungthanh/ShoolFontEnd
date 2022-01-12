import { BaseModel } from './base.model';
import { ReviewQuestion } from './review-question';

export class Knowledge extends BaseModel{

    contents?: string;
    knowledgeName?: string;
    url?: string;
    chapter?: string;
    block?: string;
    mathDesign?: string;
    reviewQuestions?: Array<ReviewQuestion> | Array<string>;
}

export interface ChapterOfKnowledge {
  block?: string;
  mathDesign?: string;
  chapter?: string;
  contents?: string;
  knowledgeName?: string;
  reviewQuestions?: Array<ReviewQuestion> | Array<string>;
}

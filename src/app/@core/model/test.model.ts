import { EAnswer } from 'src/app/@admin/modules/test/test.component';
import { TestType } from 'src/app/@core/model/testType.model';
import { BaseModel } from './base.model';
export interface Test extends BaseModel {
    question?: string;
    answerCorrect?: string | EAnswer;
    answer1?: string;
    answer2?: string;
    answer3?: string;
    answer4?: string;
    answerEssay?: string;
    point?: number;
    testType?: string | TestType;
}

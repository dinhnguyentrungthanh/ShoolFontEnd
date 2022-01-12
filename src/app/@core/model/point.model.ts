import { EAnswer } from 'src/app/@admin/modules/test/test.component';
import { TestType } from './testType.model';
import { User } from 'src/app/@core/model/user.model';
import { BaseModel } from './base.model';

export class Point extends BaseModel {
    user?: string | User;
    testType?: string;
    point?: number = 0;
    testMemo: TestResult[] = [];
    timeLeft?: number;
    answerEssay?: string;
    completed?: boolean;
    type?: string;
}

export interface TestResult {
  id: string;
	answer: EAnswer;
	answerCorrect: EAnswer;
  question?: string;
}

import { BaseModel } from './base.model';
import { Block } from './block.model';
import { Test } from './test.model';

export interface TestType extends BaseModel {
    testTypeName?: string;
    block?: string | Block;
    type?: ETestType;
    tests?: string[] | Test[];
    time?: number;
    timeLeft?: number;
}

export enum ETestType {
  MULTI_CHOICE='MULTI_CHOICE',
  ESSAY='ESSAY',
}

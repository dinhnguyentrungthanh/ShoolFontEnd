import { BaseModel } from './base.model';
export class Theory extends BaseModel{
    theoryName?: string;
    recipeText?: string;
    status?: number;
    recipeImage?: string;
    video?: string;
}

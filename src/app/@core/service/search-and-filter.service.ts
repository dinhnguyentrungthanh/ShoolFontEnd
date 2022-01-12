import { KnowledgeService } from './knowledge.service';
import { ChapterService } from './chapter.service';
import { MathDesign } from './../model/base.mathDesign';
import { Observable } from 'rxjs';
import { MathdesignService } from './mathdesign.service';
import { Injectable } from '@angular/core';
import { Block } from '../model/block.model';
import { Chapter } from '../model/base.chapter';

@Injectable({
  providedIn: 'root'
})
export class SearchAndFilterService {

  constructor(
    private _mathDesignService: MathdesignService,
    private _chapterService: ChapterService,
    private _knowledgeService: KnowledgeService
  ) { }

  fetchMathDesignFromBlocks(blocks: Block[]): Observable<MathDesign[]> {
    const blocksSet = new Set<string>();
    blocks.forEach(b => blocksSet.add(b.id as string));
    return this._mathDesignService.fetchAllFromBlocks([...blocksSet]);
  }

  fetchChapterByMathDesigns(chatpers: Chapter[]): Observable<Chapter[]> {
    const chaptersSet = new Set<string>();
    chatpers.forEach(b => chaptersSet.add(b.id as string));
    return this._chapterService.fetchAllFromMathDesigns([...chaptersSet]);
  }

  searchingKnowledge(filter: any): Observable<Chapter[]> {
    return this._knowledgeService.searchByFilter(filter);
  }
}

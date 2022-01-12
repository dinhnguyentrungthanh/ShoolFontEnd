import { KnowledgeService } from './knowledge.service';
import { browser } from 'protractor';
import { UserService } from 'src/app/@core/service/user.service';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { Class } from '../model/base.class';
import { Block } from '../model/block.model';
import { User } from '../model/user.model';
import { BlockService } from './block.service';
import { Major } from '../model/major.model';
import { MajorService } from './major.service';
import { ClassService } from './class.service';
import { MathDesign } from '../model/base.mathDesign';
import { Chapter } from '../model/base.chapter';
import { ChapterService } from './chapter.service';
import { MathdesignService } from './mathdesign.service';
import { ObjectResponsePaging } from '../model/paging.model';
import { PagingFunction } from '../utils/PagingFunction';
import { Rolegroup } from '../model/rolegroup.model';
import { RoleService } from './role.service';
import { Role } from '../model/role.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private _blockService: BlockService,
    private _userService: UserService,
    private _majorService: MajorService,
    private _classService: ClassService,
    private _chapterService: ChapterService,
    private _mathDesignService: MathdesignService,
    private _roleService: RoleService,
    private _knowledgeService: KnowledgeService
  ) { }

  queryBlocksFromClasses(classes: Class[]): Observable<Class[]> {
    const blocks = new Set<string>();

    classes.forEach(c => blocks.add(c.block as string));

    return forkJoin([...blocks].map(block => this._blockService.findById(block as string))).pipe(
      switchMap((bs: Block[]) => of(classes.map((c: Class, i: number) => {
        c.block = bs.filter((block: Block) => block.id === c.block as string).shift();
        return c;
      }))));
  }

  queryBlockFromClass(c: Class): Observable<Class> {
    const block = c.block as string;
    if (!block) {
      return of(c);
    }

    return this._blockService.findById(block).pipe(
      switchMap((b: Block) => {
        c.block = b;
        return of(c);
      }));
  }

  queryBlocksFromMajors(majors: Major[]): Observable<Major[]> {

    const blocksSet = new Set(majors.map(c => c.block));

    return forkJoin([...blocksSet].map(block => this._blockService.findById(block as string))).pipe(
      switchMap((blocks: Block[]) => of(majors.map((c: Major, i: number) => {
        c.block = blocks.find((block: Block) => block?.id === c.block as string) as Block;
        return c;
      }))));
  }

  queryUsersFromClass(c: Class): Observable<Class> {
    const users = c.users as string[];
    if (!users || users.length === 0) {
      return of(c);
    }

    return forkJoin(users.map((userId: string) => this._userService.findById(userId)))
      .pipe(
        switchMap((users: User[]) => {
          c.users = users;
          return of(c);
        })
      );
  }

  queryMajorsFromBlock(block: Block): Observable<Block> {
    const majors = block.majors as string[];
    if (!majors || majors.length === 0) {
      return of(block);
    }

    const major$ = forkJoin(majors.map((marjorId: string) => this._majorService.findById(marjorId)));
    return major$.pipe(map((ms: Major[]) => {
      block.majors = ms;
      return block;
    }));
  }

  queryMajorsFromBlocks(blocks: Block[]): Observable<Block[]> {
    const bMajors = [...blocks].reduce((a: any, b: Block) => [...a, ...(b.majors as string[])], []);
    const majorsSet = new Set(bMajors);

    console.log(bMajors,majorsSet);

    return forkJoin([...majorsSet].map(major => this._majorService.findById(major as string))).pipe(
      switchMap((majors: Major[]) => of(blocks.map((c: Block, i: number) => {
        c.majors = (c.majors as string[]).map(m => majors.find(mdb => mdb.id === m)) as Major[];
        return c;
      }))));
  }

  queryClassesFromBlock(block: Block): Observable<Block> {
    const classes = block.classes as string[];
    if (!classes || classes.length === 0) {
      return of(block);
    }

    const class$ = forkJoin(classes.map((classId: string) => this._classService.findById(classId)));
    return class$.pipe(map((cls: Class[]) => {
      block.classes = cls;
      return block;
    }));
  }

  queryMajorsFromMathDesigns(mathDesigns: MathDesign[]): Observable<MathDesign[]> {

    const majorsset = new Set(mathDesigns.map(c => c.major));

    return forkJoin([...majorsset].map(majorId => this._majorService.findById(majorId as string))).pipe(
      switchMap((majors: Major[]) => of(mathDesigns.map((md: MathDesign, i: number) => {
        md.major = majors.find((major: MathDesign) => major.id === md.major as string) as Major;
        return md;
      }))));
  }

  queryBlockFromChapters(chapters: Chapter[]): Observable<Chapter[]> {

    const chaptersset = new Set(chapters.map(c => c.block));

    return forkJoin([...chaptersset].map(blockid => this._blockService.findById(blockid as string))).pipe(
      switchMap((blocks: Block[]) => of(chapters.map((c: Chapter, i: number) => {
        c.block = blocks.find((block: Block) => block.id === c.block as string) as Block;
        return c;
      }))));
  }

  queryMathDesignFromChapters(chapters: Chapter[]): Observable<Chapter[]> {

    const chaptersset = new Set(chapters.map(c => c.mathDesign));

    return forkJoin([...chaptersset].map(mathDesignid => this._mathDesignService.findById(mathDesignid as string))).pipe(
      switchMap((mathDesigns: MathDesign[]) => of(chapters.map((c: Chapter, i: number) => {
        c.mathDesign = mathDesigns.find((m: MathDesign) => m.id === c.mathDesign as string) as MathDesign;
        return c;
      }))));
  }

  queryMathDesignsFromMajors(majors: Major[]): Observable<Major[]> {

    // get all mathDesign Id from all majors

    const mdsSet = [...majors].reduce((a: Set<string>, b: Major) => {

      (b.mathDesigns as string[])?.forEach(mdId => a.add(mdId));
      return a;
    }, new Set<string>());


    return forkJoin([...mdsSet].map(mathDesignid => this._mathDesignService.findById(mathDesignid as string))).pipe(
      concatMap((mathDesigns: MathDesign[]) => of(majors.map((m: Major, i: number) => {
        //binding obj for major.mathDesigns to replace string[] type
        const mdsObj = (m.mathDesigns as string[])?.map(mdId => mathDesigns.find(md => md.id === mdId));

        m.mathDesigns = mdsObj as MathDesign[];
        return m;
      }))));
  }

  bindingPaging<T extends PagingFunction>(obj: ObjectResponsePaging<any>, component: T): Observable<any> {
    component.rows = obj.size as number;
    component.totalRecords = obj.totalElements as number;
    return of(obj.elements);
  }
}

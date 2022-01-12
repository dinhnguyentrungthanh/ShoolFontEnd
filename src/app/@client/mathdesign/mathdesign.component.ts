import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Chapter } from 'src/app/@core/model/base.chapter';
import { Knowledge } from 'src/app/@core/model/knowledge.model';
import { ChapterService } from 'src/app/@core/service/chapter.service';

@Component({
  selector: 'app-mathdesign',
  templateUrl: './mathdesign.component.html',
  styleUrls: ['./mathdesign.component.scss']
})
export class MathdesignComponent implements OnInit {

  chapterListTree!: TreeNode<string>[];

  chapters!: Chapter[];

  chapter!: Chapter;

  blockSeo = '';
  majorSeo = '';
  mathDesignSeo = '';

  constructor(
    private _chapterService: ChapterService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params
      .pipe(
        tap((params: any) => {
          this.blockSeo = params.blockSeo;
          this.majorSeo = params.majorSeo;
          this.mathDesignSeo = params.mathDesignSeo;
        }),
        switchMap((params: any) =>
          this._chapterService.fetchAllFromBlockAndMajorAndMathdesign(params.blockSeo, params.majorSeo, params.mathDesignSeo)
        )
      )
      .subscribe((chapters: Chapter[]) => {
        this.chapterListTree = this.transformchaptersToKnowlegde(chapters);
      });

  }

  private transformchaptersToKnowlegde(cs: Chapter[]): Array<TreeNode<string>> {
    const rolesTransform = [...cs].map(c => {

      // childrend node
      const itemKnowledge: Array<TreeNode<any>> = (c.knowledges as Knowledge[]).map(k => ({
        label: k.knowledgeName as string,
        data: [c.url ,k.url],
        type: 'url'
      }));

      // parent node
      const item: TreeNode<any> = {
        label: c.chaptername as string,
        data: c.url,
        children: itemKnowledge
      };
      return item;
    }).sort();

    return rolesTransform;
  }

  nodeSelect(event: any): void {
    console.log(event);
  }
}

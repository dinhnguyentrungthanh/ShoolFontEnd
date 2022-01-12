import { TestType } from './../../@core/model/testType.model';
import { TestTypeService } from './../../@core/service/testType.service';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { pipe, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Block } from 'src/app/@core/model/block.model';
import { Major } from 'src/app/@core/model/major.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { MajorService } from 'src/app/@core/service/major.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  blocks$!: Observable<Block[]>;

  blocks!: Block[];

  block!: Block;

  major!: Major;

  majors!: Major[];

  mathDesign!: MathDesign;

  mathDesigns!: MathDesign[];

  displayPosition!: boolean;

  position!: string;

  urlmj!: string;

  testTypes!: TestType;

  constructor(
    private _blockService: BlockService,
    private _mathDSService: MathdesignService
  ) { }

  ngOnInit(): void {
    this.fetchAllData();
  }

  showPositionDialog(block: Block) {
    this.block = block;
    this.majors = block.majors as Major[];

    // Get all mathDesign id
    const setMds = new Set<string>();

    (block.majors as Major[]).forEach(element => {
      (element.mathDesigns as string[])?.forEach((md: string) => setMds.add(md));
    });


    // Find all MathDesign
    this._mathDSService.findByIds([...setMds])
      .subscribe((data: MathDesign[]) => {
        this.mathDesigns = data;
      });

    // config for Position Dialog
    this.position = 'top';
    this.displayPosition = true;
  }

  private fetchAllData(): void {
    this.blocks$ = this._blockService.findAllNotPaging()
      .pipe(
        tap(data => {
          this.blocks = data;
        })
      );
  }
}

import { ActivatedRoute } from '@angular/router';
import { TestType, ETestType } from 'src/app/@core/model/testType.model';
import { Component, Input, OnInit } from '@angular/core';
import { concatMap, take, tap } from 'rxjs/operators';
import { TestTypeService } from 'src/app/@core/service/testType.service';

@Component({
  selector: 'app-test-type-detail',
  templateUrl: './test-type-detail.component.html',
  styleUrls: ['./test-type-detail.component.scss']
})
export class TestTypeDetailComponent implements OnInit {

  testTypeId!: string;

  testType: TestType = {};

  type = ETestType;

  eTestType = ETestType.MULTI_CHOICE;

  constructor(
    private _route: ActivatedRoute,
    private _testTypeService: TestTypeService
  ) { }

  ngOnInit(): void {
    this._fetchAllData();
  }

  private _fetchAllData(): void {
    this._route.params
      .pipe(
        take(1),
        tap(params => this.testTypeId = params.id),
        concatMap(params => this._testTypeService.findById(params.id))
      )
      .subscribe((k: TestType) => {
        this.testType = k;
        this.eTestType = k.type as ETestType;
      });
  }

}

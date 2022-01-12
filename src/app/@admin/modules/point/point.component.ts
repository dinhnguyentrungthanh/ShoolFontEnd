import { Point } from './../../../@core/model/point.model';
import { PointService } from './../../../@core/service/point.service';
import { Router } from '@angular/router';
import { TestType } from '../../../@core/model/testType.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Block } from 'src/app/@core/model/block.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { NotifyService } from 'src/app/@core/service/notify.service';
import { Mapping } from 'src/app/@core/utils/mapping.util';
import { TestTypeService } from 'src/app/@core/service/testType.service';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private _blockService: BlockService,
    private _notifyService: NotifyService,
    private _helperService: HelperService,
    private _dialogService: DialogService,
    private _testTypeService: TestTypeService,
    private _pointService: PointService
  ) { }

  ngOnInit(): void {

  }

}

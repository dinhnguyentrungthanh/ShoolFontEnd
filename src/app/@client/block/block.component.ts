import { ChatService } from './../../@core/service/chat.service';
import { NotifyService } from './../../@core/service/notify.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TestingService, TestingStore } from './../../@core/service/testing.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  providers: [MessageService]
})
export class BlockComponent implements OnInit {

  constructor(
    private _testingService: TestingService,
    private _router: Router,
    private _notifyService: NotifyService,
    private serviceWS: ChatService
  ) {
    this.serviceWS.connect();
  }

  showDialog$!: Observable<boolean>;
  isShowDialog = false;

  ngOnInit(): void {
    this._testingService.testing$.subscribe(_ => {
      console.log(_);
      const testingStore = this._testingService.getCurrentState() as TestingStore;

      console.log(testingStore);
      this._router.navigate(testingStore.route);
      this.isShowDialog = true;
      this._notifyService.clear();
      this._notifyService.showWarning('123?');
    });
  }

  handler(): void {
    this.isShowDialog = false;
    const testingStore = this._testingService.getCurrentState() as TestingStore;
    this._router.navigate(testingStore.route);
  }

}

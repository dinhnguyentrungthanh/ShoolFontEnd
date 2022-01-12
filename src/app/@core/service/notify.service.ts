import { ToastCfg } from '../config/toast.config';

import { Message, MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

export enum NotifyType {
  SUCCESS = 'success',
  WARNING = 'warn',
  INFO = 'info',
  ERROR = 'error'
}

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private _messageService: MessageService
  ) { }

  showError(message: string): void{
    this._messageService.add(this.fillData(message, NotifyType.ERROR));
  }

  showInfo(message: string): void{
    this._messageService.add(this.fillData(message, NotifyType.INFO));
  }

  showWarning(message: string): void{
    this._messageService.add(this.fillData(message, NotifyType.WARNING));
  }

  showSuccess(message: string): void{
    this._messageService.add(this.fillData(message, NotifyType.SUCCESS));
  }

  clear(): void {
    this._messageService.clear();
  }

  private fillData(detail: string, severity: string): Message{
    return {severity, detail, summary: ToastCfg.SUMARY, life: ToastCfg.TIME_LIFE};
  }
}

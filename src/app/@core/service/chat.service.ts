import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
// import * as Stomp from 'stompjs';
// import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket$!: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public stompClient: any;
  //public messages$ = this.messagesSubject$.pipe(switchAll<any>(), catchError(e => { throw e; }));;

  constructor() { }

  public connect(): void {
  // const url = 'ws://localhost/websocket/blog';
  //  const socket = new SockJS(url);
  //  this.stompClient = Stomp.over(socket);
  //  const headers = {};
  //  this.stompClient.connect(headers, () => {
  //    this.stompClient.subscribe('/topic/blog', (data: any) => {
  //      this.messagesSubject$.next(JSON.parse(data.body));
  //    });
  //  });
  }

  // private getNewWebSocket() {
  //   return webSocket(environment.chatUrl);
  // }

  sendMessage(msg: any) {
    this.socket$.next(msg);
    this.socket$.subscribe(console.log);
  }

  close() {
    this.socket$.complete();
  }

  onMessageReceived(msg: any) {
    const notification = JSON.parse(msg.body);
  }

}

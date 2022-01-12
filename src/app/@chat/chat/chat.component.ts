import { Router } from '@angular/router';
import { ChatService } from './../../@core/service/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  username = '';

  constructor(
    private _chatService: ChatService,
    private router: Router) { }

  ngOnInit() {
    const jwtToken = localStorage.getItem('JWT_TOKEN');
    const username = localStorage.getItem('USERNAME');
    if (jwtToken && username) {
      this.username = username;
    } else {
      this.router.navigateByUrl('/admin/login');
    }
  }

}

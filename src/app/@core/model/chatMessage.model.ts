import { BaseModel } from './base.model';

export class ChatMessage extends BaseModel {
  chatCode?: string;
  senderId?: string;
  recipientId?: string;
  content?: string;
}

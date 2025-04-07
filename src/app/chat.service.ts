import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

export class Message{
  constructor(public author:string, public content: string){}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  conversation = new Subject<Message[]>();

  constructor(private http: HttpClient) {}

  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);

    this.callLLM(msg).subscribe((res: any) => {
      const content = res.choices?.[0]?.message?.content || 'No reply';
      const botMessage = new Message('bot', content);
      this.conversation.next([botMessage]);
    });
  }

  callLLM(message: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer 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`,
    };

    return this.http.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    }, { headers });
  }
}
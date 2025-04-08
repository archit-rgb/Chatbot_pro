import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  conversation = new Subject<Message[]>();
  private genAI = new GoogleGenerativeAI('AIzaSyB_cyzUFtmTxN_h10_ajuQUmS0QMiwlzgg');
  private model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

  constructor() {}

  getBotAnswer(message: string) {
    this.conversation.next([new Message('user', message)]);

    this.model
      .generateContent(message)
      .then(result => {
        const text = result.response.text();
        this.conversation.next([new Message('bot', text)]);
      })
      .catch(err => {
        console.error('Gemini error:', err);
        this.conversation.next([new Message('bot', 'Sorry, there was an error.')]);
      });
  }
}



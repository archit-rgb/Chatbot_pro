import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class Message{
  constructor(public author:string, public content: string){}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }
  conversation = new Subject<Message[]>();
  messageMap: any ={
    "hi":"hello",
    "Hi":"Hello",
    "who are you": "I am Chat Bot",
    "Who are you": "I am Chat Bot",
    "What is your name": "My name is chatbot",
    "what is your name": "my name is chatbot",
    "How old are you": "just born",
    "how old are you":"just born",
    "what you do":"i am an AI trained model",
    "What you do":"i am an AI trained model",
    "Do you know siri": "She is my friend",
    "What is angular":"its a framework",
    "what is angular":"its a framework",
    "default":"I can't understand"



  }
  getBotAnswer(msg:any){
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));
    setTimeout(() => {
      this.conversation.next([botMessage]);
    }, 1500);
  }
  getBotMessage(question:any){
    let answer = this.messageMap[question];
    return answer || this.messageMap['default']

  }
}

import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service'; // Import AuthService
import { User } from 'firebase/auth';

@Component({
  selector: 'app-chat',
  imports: [FormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] // Fixed: should be "styleUrls"
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  value: string = ''; // Fixed: Renamed to match usage in sendMessage()
  user:any = null;

  constructor(private chatService: ChatService, private authService: AuthService) {} // Fixed: Injected ChatService properly

  ngOnInit(): void {
    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val); // Fixed: Syntax error
      
    });
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    
  }

  sendMessage() {
    if (this.value.trim()) { // Prevent sending empty messages
      this.chatService.getBotAnswer(this.value);
      this.value = ''; // Clear input after sending
    }
  }
  signInWithGoogle() {
    this.authService.googleSignIn().catch(error => console.log(error));
  }

  signOut() {
    this.authService.signOut();
  }

  
}




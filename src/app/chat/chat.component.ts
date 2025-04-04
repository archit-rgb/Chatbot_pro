import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service'; // Import AuthService
import { Router } from '@angular/router';

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

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) {} // Fixed: Injected ChatService properly

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
    }

    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val); // Fixed: Syntax error
      
    });
    
    
  }

  sendMessage() {
    if (this.value.trim()) { // Prevent sending empty messages
      this.chatService.getBotAnswer(this.value);
      this.value = ''; // Clear input after sending
    }
  }
  logout() {
    this.authService.logout();
  }
}

  





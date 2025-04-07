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
  
  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
  
      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(content);
          this.messages.push(new Message('bot', `Parsed JSON:\n${JSON.stringify(data, null, 2)}`));
        } catch (e) {
          this.messages.push(new Message('bot', 'Invalid JSON file.'));
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
          }, {} as any);
        });
  
        this.messages.push(new Message('bot', `Parsed CSV:\n${JSON.stringify(rows, null, 2)}`));
      } else {
        this.messages.push(new Message('bot', 'Unsupported file format. Please upload .json or .csv.'));
      }
    };
  
    reader.readAsText(file);
  }

}


  





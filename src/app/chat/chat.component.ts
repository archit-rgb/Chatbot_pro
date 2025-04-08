import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-chat',
  imports: [FormsModule,CommonModule,NgChartsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] // Fixed: should be "styleUrls"
})
export class ChatComponent implements OnInit {
  chartData: any = [];
  chartLabels: string[] = [];
  showChart = false;
  messages: Message[] = [];
  value: string = ''; // Fixed: Renamed to match usage in sendMessage()
  user:any = null;

  parsedCSVData: any[] = [];

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
      const userMessage = this.value;
      //this.messages.push(new Message('user', userMessage));

      let fullPrompt = userMessage;

      if (this.parsedCSVData.length > 0) {
        fullPrompt += `\n\nHere is the CSV data:\n${JSON.stringify(this.parsedCSVData, null, 2)}`;
      }

      this.chatService.getBotAnswer(this.value);
      this.value = ''; // Clear input after sending
    }
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
          this.parsedCSVData = data;
          this.messages.push(new Message('bot', `Parsed JSON:\n${JSON.stringify(data, null, 2)}`));
        } catch (e) {
          this.messages.push(new Message('bot', 'Invalid JSON file.'));
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());

  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i]?.trim();
      return obj;
    }, {} as any);
  });
  
  this.parsedCSVData = rows;

  if (headers.length >= 2) {
    this.chartLabels = rows.map(row => row[headers[0]]);
    this.chartData = [{
      data: rows.map(row => parseFloat(row[headers[1]])),
      label: headers[1]
    }];
    this.showChart = true;

    this.messages.push(new Message('bot', `CSV uploaded and chart ready with ${rows.length} rows.`));
        } else {
          this.messages.push(new Message('bot', 'CSV must have at least 2 columns for chart.'));
        }
      } else {
        this.messages.push(new Message('bot', 'Unsupported file format.'));
      }
    };

    reader.readAsText(file);
  }
}


  





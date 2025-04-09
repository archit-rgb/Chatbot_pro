import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-chat',
  imports: [FormsModule,CommonModule,NgChartsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chartData: any = [];
  chartLabels: string[] = [];
  chartType: ChartType = 'radar';
  showChart = false;
  messages: Message[] = [];
  value: string = '';
  user:any = null;

  parsedCSVData: any[] = [];

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) {} // Fixed: Injected ChatService properly

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
    }

    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val); 
      
    });
    
    
  }

  sendMessage() {
    if (this.value.trim()) {
      const userMessage = this.value.trim();
      const lowerMsg = userMessage.toLowerCase();
      const hasChartTrigger = lowerMsg.includes('chart') || lowerMsg.includes('plot') || lowerMsg.includes('graph');
  
      // full prompt for the bot
      let fullPrompt = userMessage;
      if (hasChartTrigger && this.parsedCSVData.length > 0) {
        fullPrompt += `\n\nHere is the CSV data:\n${JSON.stringify(this.parsedCSVData, null, 2)}`;
      }
  
      // Send message to bot
      this.chatService.getBotAnswer(fullPrompt);
      this.value = '';
  
      // Chart generation logic
      if (hasChartTrigger && this.parsedCSVData.length > 0) {
        const headers = Object.keys(this.parsedCSVData[0]);
        if (headers.length >= 2) {
          this.chartLabels = this.parsedCSVData.map(row => row[headers[0]]);
          this.chartData = [{
            data: this.parsedCSVData.map(row => parseFloat(row[headers[1]])),
            label: headers[1]
          }];
          this.showChart = true;
  
          this.messages.push(new Message('bot', `Chart generated from CSV data.`));
        } else {
          this.messages.push(new Message('bot', 'CSV must have at least 2 columns to create a chart.'));
        }
      }
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
          this.messages.push(new Message('bot', `JSON uploaded successfully. Ready to use.`));
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
        this.messages.push(new Message('bot', `CSV uploaded successfully. Ready to generate chart when prompted.`));
      } else {
        this.messages.push(new Message('bot', 'Unsupported file format.'));
      }
    };
  
    reader.readAsText(file);
  }
}


  





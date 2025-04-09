import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ChartType,ChartTypeRegistry } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-chat',
  imports: [FormsModule,CommonModule,NgChartsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chartType: keyof ChartTypeRegistry = 'line';
  chartData: any = [];
  chartLabels: string[] = [];
  showChart = false;
  messages: Message[] = [];
  value: string = '';
  user:any = null;

  parsedCSVData: any[] = [];

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) {}

  updateChartTypeFromPrompt(prompt: string) {
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('bar')) {
      this.chartType = 'bar';
    } else if (promptLower.includes('line')) {
      this.chartType = 'line';
    } else if (promptLower.includes('pie')) {
      this.chartType = 'pie';
    } else if (promptLower.includes('doughnut')) {
      this.chartType = 'doughnut';
    } else if (promptLower.includes('radar')) {
      this.chartType = 'radar';
    } else if (promptLower.includes('polar')) {
      this.chartType = 'polarArea';
    } else if (promptLower.includes('bubble')) {
      this.chartType = 'bubble';
    } else if (promptLower.includes('scatter')) {
      this.chartType = 'scatter';
    } else {
      this.chartType = 'line'; // fallback
    }
  }

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

      this.updateChartTypeFromPrompt(userMessage);
  
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


  





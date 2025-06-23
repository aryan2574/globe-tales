import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ChatbotService } from '../../../services/chatbot.service';
import { ChatbotRequest, ChatbotResponse } from '../../../models/chatbot.model';
import { LocationService, Location } from '../../../services/location.service';

interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnDestroy, AfterViewChecked {
  isChatOpen = false;
  userMessage = '';
  messages: Message[] = [];
  private locationSubscription: Subscription | null = null;
  @ViewChild('chatBody') chatBody!: ElementRef;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  constructor(
    private chatbotService: ChatbotService,
    private locationService: LocationService
  ) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      this.getGreetingMessage();
    } else if (!this.isChatOpen && this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.locationSubscription = null;
    }
  }

  private getGreetingMessage() {
    this.locationSubscription = this.locationService.location$.subscribe(
      (location) => {
        if (location) {
          this.chatbotService
            .getGreeting(location.latitude, location.longitude)
            .subscribe((response) => {
              const botMsg: Message = { text: response.reply, isUser: false };
              this.messages.push(botMsg);
            });
        }
      }
    );
  }

  async sendMessage() {
    if (this.userMessage.trim() === '') {
      return;
    }

    const userMsg: Message = { text: this.userMessage, isUser: true };
    this.messages.push(userMsg);

    const request: ChatbotRequest = { message: this.userMessage };

    try {
      const location = await firstValueFrom(this.locationService.location$);
      if (location) {
        request.latitude = location.latitude;
        request.longitude = location.longitude;
      }
    } catch (error) {
      console.warn(
        "Could not get user's location. Sending message without it."
      );
    }

    this.chatbotService.chat(request).subscribe((response: ChatbotResponse) => {
      const botMsg: Message = { text: response.reply, isUser: false };
      this.messages.push(botMsg);
    });

    this.userMessage = '';
  }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollAnchor) {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

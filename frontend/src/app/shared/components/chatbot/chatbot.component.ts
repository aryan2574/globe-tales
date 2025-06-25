import {
  Component,
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
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

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
export class ChatbotComponent implements AfterViewChecked {
  isChatOpen = false;
  userMessage = '';
  messages: Message[] = [];
  private currentUser: User | null = null;
  @ViewChild('chatBody') chatBody!: ElementRef;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  quickActions = [
    { label: 'Show me popular places', action: 'popular_places' },
    { label: 'Get weather update', action: 'weather_update' },
    { label: 'My achievements', action: 'my_achievements' },
    { label: 'My favorites', action: 'my_favorites' },
  ];

  constructor(
    private chatbotService: ChatbotService,
    private locationService: LocationService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      const greeting = this.currentUser
        ? `Hi ${this.currentUser.username}, how may I help you?`
        : 'Hi, how may I help you?';
      this.messages.push({ text: greeting, isUser: false });
    }
  }

  handleQuickAction(action: string) {
    let message = '';
    switch (action) {
      case 'popular_places':
        message = 'Show me popular places';
        break;
      case 'weather_update':
        message = 'Get weather update';
        break;
      case 'my_achievements':
        message = 'My achievements';
        break;
      case 'my_favorites':
        message = 'My favorites';
        break;
      default:
        return;
    }
    this.userMessage = message;
    this.sendMessage();
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollAnchor) {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

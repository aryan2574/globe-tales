import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatbotRequest, ChatbotResponse } from '../models/chatbot.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = '/api/chat';

  constructor(private http: HttpClient) {}

  chat(request: ChatbotRequest): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(this.apiUrl, request);
  }

  getGreeting(lat: number, lon: number): Observable<ChatbotResponse> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString());
    return this.http.get<ChatbotResponse>(`${this.apiUrl}/greeting`, {
      params,
    });
  }
}

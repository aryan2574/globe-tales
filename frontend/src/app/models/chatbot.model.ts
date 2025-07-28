export interface ChatbotRequest {
  message: string;
  latitude?: number;
  longitude?: number;
}

export interface ChatbotResponse {
  reply: string;
}

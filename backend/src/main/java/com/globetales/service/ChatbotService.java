package com.globetales.service;

import com.globetales.dto.ChatbotRequest;
import com.globetales.dto.ChatbotResponse;

public interface ChatbotService {
    ChatbotResponse chat(ChatbotRequest chatbotRequest);
} 
package com.globetales.service.impl;

import com.globetales.dto.ChatbotRequest;
import com.globetales.dto.ChatbotResponse;
import com.globetales.service.ChatbotService;
import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final OpenAIClient openAIClient;

    @Value("${openai.chatbot.system-message}")
    private String systemMessage;

    public ChatbotServiceImpl(OpenAIClient openAIClient) {
        this.openAIClient = openAIClient;
    }

    @Override
    public ChatbotResponse chat(ChatbotRequest chatbotRequest) {
        String fullSystemMessage = systemMessage;

        if (chatbotRequest.getLatitude() != null && chatbotRequest.getLongitude() != null) {
            String locationContext = String.format(
                " The user's current location is latitude: %s and longitude: %s. Use this information to answer any location-based questions.",
                chatbotRequest.getLatitude(),
                chatbotRequest.getLongitude()
            );
            fullSystemMessage += locationContext;
        }

        ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                .addSystemMessage(fullSystemMessage)
                .addUserMessage(chatbotRequest.getMessage())
                .model(ChatModel.GPT_3_5_TURBO)
                .build();

        ChatCompletion chatCompletion = openAIClient.chat().completions().create(params);
        String reply = chatCompletion.choices().get(0).message().content().orElse(null);

        return new ChatbotResponse(reply);
    }
} 
package com.globetales.service.impl;

import com.globetales.dto.ChatbotRequest;
import com.globetales.dto.ChatbotResponse;
import com.globetales.dto.RecommendationDTO;
import com.globetales.dto.RecommendationResponseDTO;
import com.globetales.dto.UserAchievementDTO;
import com.globetales.dto.UserFavouriteDTO;
import com.globetales.dto.WeatherResponseDTO;
import com.globetales.service.ChatbotService;
import com.globetales.service.RecommendationService;
import com.globetales.service.UserAchievementService;
import com.globetales.service.UserFavouriteService;
import com.globetales.service.UserService;
import com.globetales.service.WeatherService;
import com.globetales.entity.User;
import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final OpenAIClient openAIClient;
    private final WeatherService weatherService;
    private final RecommendationService recommendationService;
    private final UserAchievementService userAchievementService;
    private final UserFavouriteService userFavouriteService;
    private final UserService userService;

    @Value("${openai.chatbot.system-message}")
    private String systemMessage;

    public ChatbotServiceImpl(OpenAIClient openAIClient,
                             WeatherService weatherService,
                             RecommendationService recommendationService,
                             UserAchievementService userAchievementService,
                             UserFavouriteService userFavouriteService,
                             UserService userService) {
        this.openAIClient = openAIClient;
        this.weatherService = weatherService;
        this.recommendationService = recommendationService;
        this.userAchievementService = userAchievementService;
        this.userFavouriteService = userFavouriteService;
        this.userService = userService;
    }

    @Override
    @Cacheable(value = "chatbot", key = "#chatbotRequest.message + '-' + #chatbotRequest.latitude + '-' + #chatbotRequest.longitude", cacheManager = "chatbotCacheManager")
    public ChatbotResponse chat(ChatbotRequest chatbotRequest) {
        String message = chatbotRequest.getMessage().trim().toLowerCase();
        User user = null;
        try {
            user = userService.getCurrentUserEntity();
        } catch (Exception ignored) {}

        // --- Location fallback logic ---
        Double lat = chatbotRequest.getLatitude();
        Double lon = chatbotRequest.getLongitude();
        if ((lat == null || lon == null) && user != null) {
            lat = user.getLatitude();
            lon = user.getLongitude();
        }

        // Quick Action: Weather
        if (message.equals("get weather update")) {
            if (lat != null && lon != null) {
                WeatherResponseDTO weather = weatherService.getWeather(lat, lon);
                String desc = com.globetales.service.impl.WeatherServiceImpl.getWeatherDescription(weather.getCurrentWeather().getWeatherCode());
                double temp = weather.getCurrentWeather().getTemperature();
                return new ChatbotResponse(String.format("The current weather at your location is %.1f°C and %s.", temp, desc));
            } else {
                return new ChatbotResponse("Sorry, I couldn't get your location for the weather update.");
            }
        }

        // Quick Action: Popular Places
        if (message.equals("show me popular places")) {
            if (lat != null && lon != null) {
                // Temporarily create a user with lat/lon if user is null
                User effectiveUser = user;
                if (effectiveUser == null) {
                    effectiveUser = new User();
                    effectiveUser.setLatitude(lat);
                    effectiveUser.setLongitude(lon);
                } else {
                    effectiveUser.setLatitude(lat);
                    effectiveUser.setLongitude(lon);
                }
                RecommendationResponseDTO recs = recommendationService.getRecommendations("foot-walking", 5000, 0, 5);
                List<RecommendationDTO> list = recs.getRecommendations();
                if (list.isEmpty()) {
                    return new ChatbotResponse("Sorry, I couldn't find any popular places near you.");
                }
                String places = list.stream()
                        .map(r -> r.getPlace().getName() + (r.getPlace().getType() != null ? " (" + r.getPlace().getType() + ")" : ""))
                        .collect(Collectors.joining(", "));
                return new ChatbotResponse("Popular places near you: " + places);
            } else {
                return new ChatbotResponse("Sorry, I couldn't get your location to find popular places.");
            }
        }

        // Quick Action: Achievements
        if (message.equals("my achievements")) {
            if (user != null) {
                List<UserAchievementDTO> achievements = userAchievementService.findByUserId(user.getId());
                if (achievements.isEmpty()) {
                    return new ChatbotResponse("You have not earned any achievements yet.");
                }
                String ach = achievements.stream()
                        .map(a -> a.getDisplayName() + (a.getDescription() != null ? ": " + a.getDescription() : ""))
                        .collect(Collectors.joining("\n"));
                return new ChatbotResponse("Your achievements:\n" + ach);
            } else {
                return new ChatbotResponse("Sorry, I couldn't get your achievements.");
            }
        }

        // Quick Action: Favorites
        if (message.equals("my favorites") || message.equals("my favourites")) {
            if (user != null) {
                List<UserFavouriteDTO> favs = userFavouriteService.findByUserId(user.getId());
                if (favs.isEmpty()) {
                    return new ChatbotResponse("You have not added any favorites yet.");
                }
                String favList = favs.stream()
                        .map(f -> f.getPlaceName() != null ? f.getPlaceName() : (f.getSiteType() != null ? f.getSiteType() : "Unknown"))
                        .collect(Collectors.joining(", "));
                return new ChatbotResponse("Your favorite places: " + favList);
            } else {
                return new ChatbotResponse("Sorry, I couldn't get your favorites.");
            }
        }

        // Default: OpenAI
        String fullSystemMessage = systemMessage;
        if (user != null) {
            String userContext = String.format(
                " The user's name is %s, they are level %s and have %d experience points.",
                user.getDisplayName(),
                user.getLevel(),
                user.getExperiencePoints()
            );
            fullSystemMessage += userContext;
        }

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
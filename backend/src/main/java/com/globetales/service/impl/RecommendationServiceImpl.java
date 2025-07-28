package com.globetales.service.impl;

import com.globetales.dto.PointDTO;
import com.globetales.dto.RecommendationDTO;
import com.globetales.dto.RecommendationResponseDTO;
import com.globetales.dto.RouteRequestDTO;
import com.globetales.dto.RouteResponseDTO;
import com.globetales.entity.Place;
import com.globetales.entity.User;
import com.globetales.entity.VisitedSite;
import com.globetales.repository.PlaceRepository;
import com.globetales.repository.VisitedSiteRepository;
import com.globetales.service.RecommendationService;
import com.globetales.service.RouteService;
import com.globetales.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final PlaceRepository placeRepository;
    private final VisitedSiteRepository visitedSiteRepository;
    private final UserService userService;
    private final RouteService routeService;
    private RecommendationService self;

    @Autowired
    public void setSelf(@Lazy RecommendationService self) {
        this.self = self;
    }

    @Override
    public RecommendationResponseDTO getRecommendations(String transportMode, double maxDistance, int page, int size) {
        User currentUser = userService.getCurrentUserEntity();

        // This now calls the proxied (and therefore cacheable) method
        List<RecommendationDTO> allRecommendations = self.getCachedRecommendations(currentUser, transportMode, maxDistance);

        int start = page * size;
        if (start >= allRecommendations.size()) {
            return new RecommendationResponseDTO(List.of(), false);
        }

        int end = Math.min(start + size, allRecommendations.size());
        List<RecommendationDTO> pagedRecommendations = allRecommendations.subList(start, end);
        boolean hasMore = end < allRecommendations.size();

        log.info("Returning page {} with {} recommendations. Has more: {}", page, pagedRecommendations.size(), hasMore);
        return new RecommendationResponseDTO(pagedRecommendations, hasMore);
    }

    @Override
    @Cacheable(value = "recommendations", key = "#user.id + '-' + #transportMode + '-' + #maxDistance")
    public synchronized List<RecommendationDTO> getCachedRecommendations(User user, String transportMode, double maxDistance) {
        Double startLat = user.getLatitude();
        Double startLon = user.getLongitude();

        if (startLat == null || startLon == null) {
            log.warn("Cannot get recommendations because user {} has no location set.", user.getId());
            return List.of();
        }

        // Search radius in km. Use a larger buffer to ensure we find places that might be close
        // via a winding route.
        double searchRadius = (maxDistance / 1000) * 2.0;
        List<Place> nearbyPlaces = placeRepository.findNearbyPlaces(startLat, startLon, searchRadius);
        log.info("Found {} nearby places within a {}km radius.", nearbyPlaces.size(), searchRadius);

        Set<Long> visitedPlaceIds = visitedSiteRepository.findByUserId(user.getId().toString())
                .stream()
                .map(VisitedSite::getPlaceId)
                .collect(Collectors.toSet());
        log.info("User has visited {} places.", visitedPlaceIds.size());

        List<Place> placesToConsider = nearbyPlaces.stream()
                .filter(place -> !visitedPlaceIds.contains(place.getOsmId()))
                .collect(Collectors.toList());

        List<RecommendationDTO> allPossibleRecommendations = new ArrayList<>();
        int apiHits = 0;
        final int MAX_API_HITS = 20;
        final int MAX_RECOMMENDATIONS = 15;

        for (Place place : placesToConsider) {
            if (apiHits >= MAX_API_HITS || allPossibleRecommendations.size() >= MAX_RECOMMENDATIONS) {
                log.info("Stopping recommendation search. API hits: {}/{}, Recommendations found: {}/{}",
                        apiHits, MAX_API_HITS, allPossibleRecommendations.size(), MAX_RECOMMENDATIONS);
                break;
            }

            try {
                // Introduce a small delay to avoid hitting rate limits
                Thread.sleep(1500);

                apiHits++;
                RouteRequestDTO requestDTO = RouteRequestDTO.builder()
                        .start(new PointDTO(startLat, startLon))
                        .end(new PointDTO(place.getLatitude(), place.getLongitude()))
                        .transportMode(transportMode)
                        .build();
                RouteResponseDTO routeInfo = routeService.getRoute(requestDTO);

                if (routeInfo.getDistance() <= maxDistance) {
                    log.debug("Place {} is within max distance.", place.getName());
                    allPossibleRecommendations.add(new RecommendationDTO(place, routeInfo.getDistance(), routeInfo.getDuration()));
                }
            } catch (InterruptedException e) {
                log.warn("Thread interrupted while waiting to call route service.");
                Thread.currentThread().interrupt(); // Restore interrupted status
            } catch (Exception e) {
                log.error("Could not calculate route for placeId {}: {}", place.getOsmId(), e.getMessage());
            }
        }
        
        log.info("Found {} total possible recommendations for the user.", allPossibleRecommendations.size());

       return allPossibleRecommendations;

    }
} 
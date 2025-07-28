package com.globetales.service.impl;

import com.globetales.entity.Place;
import com.globetales.repository.PlaceRepository;
import com.globetales.service.PlaceService;
import com.globetales.service.OverpassService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;
    private final OverpassService overpassService;

    public PlaceServiceImpl(PlaceRepository placeRepository, OverpassService overpassService) {
        this.placeRepository = placeRepository;
        this.overpassService = overpassService;
    }

    @Override
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).orElse(null);
    }

    @Override
    public Place getPlaceByOsmId(Long osmId) {
        return placeRepository.findByOsmId(osmId);
    }

    @Override
    public Place importPlaceByOsmId(Long osmId) throws Exception {
        return overpassService.fetchAndStorePlaceByOsmId(osmId);
    }
} 
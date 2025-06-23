package com.globetales.service.impl;

import com.globetales.entity.Place;
import com.globetales.repository.PlaceRepository;
import com.globetales.service.PlaceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;

    public PlaceServiceImpl(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @Override
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).orElse(null);
    }
} 
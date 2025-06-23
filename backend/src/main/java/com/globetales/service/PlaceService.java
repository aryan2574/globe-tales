package com.globetales.service;

import com.globetales.entity.Place;
import java.util.List;

public interface PlaceService {
    List<Place> getAllPlaces();
    Place getPlaceById(Long id);
} 
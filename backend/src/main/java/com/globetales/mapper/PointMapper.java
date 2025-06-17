package com.globetales.mapper;

import com.globetales.dto.PointDTO;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class PointMapper {
    @Autowired
    protected GeometryFactory geometryFactory;

    public PointDTO toDTO(Point point) {
        if (point == null) return null;
        PointDTO dto = new PointDTO();
        dto.setLatitude(point.getY());
        dto.setLongitude(point.getX());
        return dto;
    }

    public Point toEntity(PointDTO pointDTO) {
        if (pointDTO == null) return null;
        return geometryFactory.createPoint(new Coordinate(pointDTO.getLongitude(), pointDTO.getLatitude()));
    }
} 
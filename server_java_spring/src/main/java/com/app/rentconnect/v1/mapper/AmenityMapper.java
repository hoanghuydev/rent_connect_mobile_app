package com.app.rentconnect.v1.mapper;

import com.app.rentconnect.v1.dto.request.AmenityRequestDTO;
import com.app.rentconnect.v1.entity.Amenity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AmenityMapper {
    AmenityRequestDTO toRequestDTO(Amenity amenity);
    Amenity toAmenity(AmenityRequestDTO amenityRequestDTO);
}

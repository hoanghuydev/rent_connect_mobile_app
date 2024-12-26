package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.entity.Amenity;
import com.app.rentconnect.v1.repository.AmenityRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true,level = AccessLevel.PRIVATE)
public class AmenityQueryService {
    AmenityRepository amenityRepository;
    public Amenity findById(Long amenityId){
        return amenityRepository.findByAmenityId(amenityId).orElseThrow(() -> new RuntimeException("Not found amenity"));

    }
}

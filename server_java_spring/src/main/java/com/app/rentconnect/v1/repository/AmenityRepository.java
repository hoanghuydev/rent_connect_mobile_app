package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AmenityRepository extends JpaRepository<Amenity,Long> {
    Optional<Amenity> findByAmenityId(Long amenityId);
}

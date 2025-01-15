package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.Car;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
    @Query(value = """
        SELECT DISTINCT c FROM Car c 
        LEFT JOIN FETCH c.images i 
        WHERE c.carId = :id 
        AND c.deletedAt IS NULL 
        AND (i.deletedAt IS NULL OR i.deletedAt IS NULL)
        """)
    Optional<Car> findById(Long id);
}

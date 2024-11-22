package com.app.rentconnect.repository;

import com.app.rentconnect.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
    Optional<Car> findByCarId(Long carId);

}

package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
}

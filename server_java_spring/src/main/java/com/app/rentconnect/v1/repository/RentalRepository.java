package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Rental r WHERE r.car.carId = :carId AND ((r.startDate <= :endDate AND r.endDate >= :startDate))")
    boolean existsByRentalPeriod(LocalDateTime startDate,LocalDateTime endDate,Long carId);

    List<Rental> findAllByCar_Owner_UserId(Long userId);

    List<Rental> findAllByCustomer_UserId(Long userId);

}

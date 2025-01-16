package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.Review;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    List<Review> findByCar_CarId(@Param("carId") Long carId);

    @Modifying
    @Transactional
    @Query("UPDATE Review r SET r.deletedAt = CURRENT_TIMESTAMP WHERE r.reviewId = :reviewId")
    int markAsDeleted(@Param("reviewId") Long reviewId);
}

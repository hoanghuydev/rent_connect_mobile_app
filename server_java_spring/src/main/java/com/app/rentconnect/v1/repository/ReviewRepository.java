package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review,Long> {
}

package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification,Long> {
    Optional<OtpVerification> findByUserEmail(String email);
}

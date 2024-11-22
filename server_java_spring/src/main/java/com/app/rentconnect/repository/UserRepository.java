package com.app.rentconnect.repository;

import com.app.rentconnect.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmailAndVerified(String email, boolean verified);
    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET verified=:isVerified WHERE email=:email",nativeQuery = true)
    void vertifyUserByEmail(String email, boolean isVerified);
    
}

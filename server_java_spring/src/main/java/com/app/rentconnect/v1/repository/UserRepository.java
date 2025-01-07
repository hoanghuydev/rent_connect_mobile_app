package com.app.rentconnect.v1.repository;

import com.app.rentconnect.v1.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Modifying
    @Transactional
    @Query("UPDATE User u SET " +
            "u.fullName = CASE WHEN :fullName IS NOT NULL AND :fullName <> '' THEN :fullName ELSE u.fullName END, " +
            "u.email = CASE WHEN :email IS NOT NULL AND :email <> '' THEN :email ELSE u.email END, " +
            "u.phoneNumber = CASE WHEN :phoneNumber IS NOT NULL AND :phoneNumber <> '' THEN :phoneNumber ELSE u.phoneNumber END, " +
            "u.updatedAt = CURRENT_TIMESTAMP " +
            "WHERE u.userId = :userId")
    int updateUser(@Param("userId") Long userId,
                   @Param("fullName") String fullName,
                   @Param("email") String email,
                   @Param("phoneNumber") String phoneNumber);
}

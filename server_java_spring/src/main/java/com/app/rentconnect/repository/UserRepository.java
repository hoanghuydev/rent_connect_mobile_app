package com.app.rentconnect.repository;

import com.app.rentconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    User findByFullName(String fullName);
    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.fullName = :fullName WHERE u.email = :email")
    boolean updateFullNameByEmail(String fullName, String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.email = :email WHERE u.email = :oldEmail")
    boolean updateEmailByEmail(String email, String oldEmail);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.phoneNumber = :phoneNumber WHERE u.email = :email")
    boolean updatePhoneNumberByEmail(String phoneNumber, String email);
}

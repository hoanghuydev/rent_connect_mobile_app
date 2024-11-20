package com.app.rentconnect.entity;

import com.app.rentconnect.Constants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
     List<Car> cars;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
     List<Rental> rentalsAsCustomer;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
     List<Rental> rentalsAsOwner;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
     List<Message> messages;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
     List<Address> addresses;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long userId;

    @Column(nullable = false, length = 100)
     String fullName;


    @Column(nullable = false, unique = true, length = 100)
     String email;

     String password;

    @Column(length = 15)
     String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
     Constants.UserType userType = Constants.UserType.customer;

    @Column(nullable = false)
     LocalDateTime createdAt = LocalDateTime.now();

     Boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
     Constants.LoginPlatform loginPlatform = Constants.LoginPlatform.email;

     String platformId;

     LocalDateTime deletedAt;
}

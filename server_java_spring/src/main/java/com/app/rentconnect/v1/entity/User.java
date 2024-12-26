package com.app.rentconnect.v1.entity;

import com.app.rentconnect.v1.Constants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> roles;

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

    @Column(nullable = false)
     LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    LocalDateTime updatedAt = LocalDateTime.now();

     Boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
     Constants.LoginPlatform loginPlatform = Constants.LoginPlatform.EMAIL;

     String platformId;

     LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

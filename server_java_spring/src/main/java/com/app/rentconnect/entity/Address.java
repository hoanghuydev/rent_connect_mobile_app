package com.app.rentconnect.entity;
import com.app.rentconnect.Constants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long addressId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Constants.AddressType addressType = Constants.AddressType.other;

    @Column(nullable = false, length = 255)
    String addressLine;

    @Column(nullable = false, length = 100)
    String province;

    @Column(nullable = false, length = 100)
    String district;

    @Column(nullable = false, length = 100)
    String ward;

    @Column(nullable = false, length = 255)
    String specificAddress;

    @Column(length = 100)
    String addressLabel;

    Boolean isDefault = false;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}
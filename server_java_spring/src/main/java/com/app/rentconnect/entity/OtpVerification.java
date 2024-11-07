package com.app.rentconnect.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "otp_verification")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long otpId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false, length = 6)
    String otpCode;

    @Column(nullable = false)
    LocalDateTime expiresAt;
}

package com.app.rentconnect.v1.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "additional_fees")
public class AdditionalFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long feeId;

    @Column(nullable = false, length = 100)
    String feeName;

    @Lob
    String description;

    @Column(nullable = false)
    BigDecimal amount;

    @Column(nullable = false, length = 50)
    String unit;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}

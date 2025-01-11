package com.app.rentconnect.v1.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "car_images")
@Where(clause = "deleted_at IS NULL")
public class CarImage {

    @Id
    @Column(nullable = false,length = 40)
    String imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    Car car;

    @Column(nullable = false, length = 255)
    String imageUrl;

    LocalDateTime deletedAt;
}

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
public class CarImage {

    @Id
    @Column(nullable = false,length = 40,name="image_id")
    String imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    Car car;

    @Column(nullable = false, length = 255,name = "image_url")
    String imageUrl;

    @Column(name="deleted_at")
    LocalDateTime deletedAt;
}

package com.app.rentconnect.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "car_amenities")
public class CarAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    Car car;

    @ManyToOne
    @JoinColumn(name = "amenity_id", nullable = false)
    Amenity amenity;
}

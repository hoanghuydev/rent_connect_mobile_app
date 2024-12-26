package com.app.rentconnect.v1.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "cars")
@Where(clause = "deleted_at IS NULL")
public class Car {

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<CarImage> images = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "car_amenities",
            joinColumns = @JoinColumn(name = "car_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    List<Rental> rentals;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    List<Review> reviews;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "car_feature_map",
            joinColumns = @JoinColumn(name = "car_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    Set<CarFeature> features = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long carId;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    @ManyToOne
    @JoinColumn(name = "transmission_id")
    Transmission transmission;

    int seats;

    @ManyToOne
    @JoinColumn(name = "fuel_id")
    Fuel fuel;

    @Column(nullable = false, length = 100)
    String carName;

    @Lob
    String description;

    @Column(nullable = false)
    BigDecimal pricePerDay;

    int timesRented = 0;



    @Column(length = 50)
    String rangePerChargeOrTank;

    @ManyToOne
    @JoinColumn(name = "location_id")
    CarLocation location;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}
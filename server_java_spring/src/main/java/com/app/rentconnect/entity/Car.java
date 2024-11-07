package com.app.rentconnect.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "cars")
public class Car {

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<CarImage> images;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<CarAmenity> amenities;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<Rental> rentals;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<CarFeatureMap> features;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long carId;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    @Column(nullable = false, length = 100)
    String carName;

    @Lob
    String description;

    @Column(nullable = false)
    BigDecimal pricePerDay;

    int timesRented = 0;

    @ManyToOne
    @JoinColumn(name = "transmission_id")
    Transmission transmission;

    int seats;

    @ManyToOne
    @JoinColumn(name = "fuel_id")
    Fuel fuel;

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
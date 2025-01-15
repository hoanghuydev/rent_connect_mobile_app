package com.app.rentconnect.v1.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
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

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    @Where(clause = "deleted_at IS NULL")
    @ToString.Exclude
    Set<CarImage> images = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "car_amenities",
            joinColumns = @JoinColumn(name = "car_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    Set<Rental> rentals;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    Set<Review> reviews;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long carId;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonBackReference
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

    @ManyToOne(cascade = CascadeType.PERSIST,fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    CarLocation location;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}
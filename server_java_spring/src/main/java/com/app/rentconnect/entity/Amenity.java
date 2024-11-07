package com.app.rentconnect.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "amenities")
public class Amenity {

    @OneToMany(mappedBy = "amenity", cascade = CascadeType.ALL)
    private List<CarAmenity> carAmenities;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long amenityId;

    @Column(nullable = false, length = 100)
    String amenityName;

    @Column(length = 255)
    String icon;

    LocalDateTime deletedAt;
}
package com.app.rentconnect.v1.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "amenities")
@JsonIgnoreProperties("cars")
@Where(clause = "deleted_at IS NULL")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long amenityId;

    @ManyToMany(mappedBy = "amenities")
    private Set<Car> cars = new HashSet<>();

    @Column(nullable = false, length = 100,unique = true)
    String amenityName;

    @Column(length = 255)
    String icon;

    LocalDateTime deletedAt;
}
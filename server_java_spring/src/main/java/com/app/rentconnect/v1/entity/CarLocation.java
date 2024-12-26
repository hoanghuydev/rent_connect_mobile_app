package com.app.rentconnect.v1.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "car_locations")
public class CarLocation {

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    private List<Car> cars;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long locationId;

    @Column(nullable = false, length = 255)
    String addressLine;

    @Column(nullable = false, length = 100)
    String province;

    @Column(nullable = false, length = 100)
    String district;

    @Column(nullable = false, length = 100)
    String ward;

    BigDecimal latitude;
    BigDecimal longitude;

    LocalDateTime deletedAt;
}

package com.app.rentconnect.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "car_features")
public class CarFeature {

    @OneToMany(mappedBy = "feature", cascade = CascadeType.ALL)
    private List<CarFeatureMap> featureMaps;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long featureId;

    @Column(nullable = false, length = 100)
    String featureName;

    LocalDateTime deletedAt;
}
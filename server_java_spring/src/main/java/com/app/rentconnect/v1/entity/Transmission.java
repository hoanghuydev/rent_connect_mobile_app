package com.app.rentconnect.v1.entity;
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
@Table(name = "transmissions")
public class Transmission {

    @OneToMany(mappedBy = "transmission", cascade = CascadeType.ALL)
    private List<Car> cars;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long transmissionId;

    @Column(nullable = false, length = 50)
    String transmissionType;

    LocalDateTime deletedAt;
}
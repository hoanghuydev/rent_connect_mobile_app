package com.app.rentconnect.entity;
import com.app.rentconnect.Constants;
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
@Table(name = "rentals")
public class Rental {

    @OneToMany(mappedBy = "rental", cascade = CascadeType.ALL)
    private List<BookingHistory> bookingHistory;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long rentalId;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    Car car;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    User customer;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    @Column(nullable = false)
    LocalDateTime startDate;

    @Column(nullable = false)
    LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Constants.RentalStatus status = Constants.RentalStatus.requested;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}
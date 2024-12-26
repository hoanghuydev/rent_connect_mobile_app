package com.app.rentconnect.v1.entity;
import com.app.rentconnect.v1.Constants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "booking_history")
public class BookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long historyId;

    @ManyToOne
    @JoinColumn(name = "rental_id", nullable = false)
    Rental rental;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Constants.RentalStatus status = Constants.RentalStatus.REQUESTED;

    @Column(nullable = false)
    @CreatedDate
    LocalDateTime updatedAt = LocalDateTime.now();

    LocalDateTime deletedAt;
}


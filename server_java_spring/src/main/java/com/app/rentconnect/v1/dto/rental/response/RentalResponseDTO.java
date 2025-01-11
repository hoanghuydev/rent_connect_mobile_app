package com.app.rentconnect.v1.dto.rental.response;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.entity.Car;
import com.app.rentconnect.v1.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RentalResponseDTO {
    Long rentalId;
    Car car;
    User customer;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Constants.RentalStatus status;
    LocalDateTime createdAt = LocalDateTime.now();
}

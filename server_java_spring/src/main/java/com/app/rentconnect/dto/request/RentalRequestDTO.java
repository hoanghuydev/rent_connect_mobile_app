package com.app.rentconnect.dto.request;

import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.car.request.CarRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class RentalRequestDTO {
    private List<BookingHistoryRequestDTO> bookingHistory;
    Long rentalId;
    CarRequestDTO car;
    UserRequestDTO customer;
    UserRequestDTO owner;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Constants.RentalStatus status = Constants.RentalStatus.requested;
    LocalDateTime createdAt = LocalDateTime.now();
    LocalDateTime deletedAt;
}

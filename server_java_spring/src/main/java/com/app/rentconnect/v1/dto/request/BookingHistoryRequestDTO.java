package com.app.rentconnect.v1.dto.request;

import com.app.rentconnect.v1.Constants;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class BookingHistoryRequestDTO {
    Long historyId;
    RentalRequestDTO rental;
    Constants.RentalStatus status;
    LocalDateTime updatedAt = LocalDateTime.now();
    LocalDateTime deletedAt;
}

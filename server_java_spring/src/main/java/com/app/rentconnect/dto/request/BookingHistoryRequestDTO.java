package com.app.rentconnect.dto.request;

import com.app.rentconnect.Constants;
import com.app.rentconnect.entity.Rental;
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

public class BookingHistoryRequestDTO {
    Long historyId;
    RentalRequestDTO rental;
    Constants.RentalStatus status;
    LocalDateTime updatedAt = LocalDateTime.now();
    LocalDateTime deletedAt;
}

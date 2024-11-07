package com.app.rentconnect.dto.request;

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

public class ReviewRequestDTO {
    Long reviewId;
    CarRequestDTO car;
    UserRequestDTO customer;
    int rating;
    String reviewText;
    LocalDateTime createdAt;
    LocalDateTime deletedAt;
}

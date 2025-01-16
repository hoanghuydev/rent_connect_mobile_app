package com.app.rentconnect.v1.dto.review;

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
public class ReviewResponseDTO {
    Long reviewId;
    String userName;
    Long userId;
    int rating;
    String content;
    LocalDateTime createdAt;
}

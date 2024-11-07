package com.app.rentconnect.dto.request;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class AdditionalFeeRequestDTO {
    Long feeId;
    String feeName;
    String description;
    BigDecimal amount;
    String unit;
    LocalDateTime createdAt = LocalDateTime.now();
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}

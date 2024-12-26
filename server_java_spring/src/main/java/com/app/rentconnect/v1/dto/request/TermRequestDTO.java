package com.app.rentconnect.v1.dto.request;
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

public class TermRequestDTO {
    Long termId;
    String termText;
    LocalDateTime createdAt = LocalDateTime.now();
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}

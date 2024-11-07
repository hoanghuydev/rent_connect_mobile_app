package com.app.rentconnect.dto.request;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransmissionRequestDTO {
    private List<CarRequestDTO> cars;
    Long transmissionId;
    String transmissionType;
    LocalDateTime deletedAt;
}

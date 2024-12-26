package com.app.rentconnect.v1.dto.request;

import com.app.rentconnect.v1.dto.car.request.CarRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class FuelRequestDTO {
    private List<CarRequestDTO> cars;
    Long fuelId;
    String fuelType;
    LocalDateTime deletedAt;
}

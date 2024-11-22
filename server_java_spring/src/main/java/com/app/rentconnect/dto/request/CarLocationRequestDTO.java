package com.app.rentconnect.dto.request;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.app.rentconnect.dto.car.request.CarRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CarLocationRequestDTO {
    private List<CarRequestDTO> cars;
    Long locationId;
    String addressLine;
    String province;
    String district;
    String ward;
    BigDecimal latitude;
    BigDecimal longitude;
    LocalDateTime deletedAt;
}

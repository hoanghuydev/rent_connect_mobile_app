package com.app.rentconnect.v1.dto.car.response;

import com.app.rentconnect.v1.dto.car.request.CarLocationRequestDTO;
import com.app.rentconnect.v1.dto.request.*;
import com.app.rentconnect.v1.dto.request.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CarResponseDTO {
    private List<CarImageRequestDTO> images;
    private List<CarAmenityRequestDTO> amenities;
    Long carId;
    UserRequestDTO owner;
    String carName;
    String description;
    BigDecimal pricePerDay;
    int timesRented = 0;
    TransmissionRequestDTO transmission;
    int seats;
    FuelRequestDTO fuel;
    String rangePerChargeOrTank;
    CarLocationRequestDTO location;
    LocalDateTime createdAt;
    LocalDateTime deletedAt;
}

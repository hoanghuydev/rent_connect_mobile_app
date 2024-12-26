package com.app.rentconnect.v1.dto.car.request;

import com.app.rentconnect.v1.dto.request.*;
import com.app.rentconnect.v1.dto.request.CarImageRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CreateCarRequestDTO {
    @NotEmpty(message = "Amenities can not empty")
    List<Long> amenityIds;
    List<Long> featureIds;

    @NotEmpty(message = "fuelId is missing")
    Long fuelId;

    @NotEmpty(message = "transmissionId is missing")
    Long transmissionId;

    @NotBlank(message = "Car name cannot be blank")
    @Size(max = 100, message = "Car name must not exceed 100 characters")
    String carName;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description;

    @NotNull(message = "Price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per day must be greater than 0")
    BigDecimal pricePerDay;
    
    @Min(value = 2, message = "Seats must be at least 2")
    int seats;

    @NotBlank(message = "Range per charge or tank cannot be blank")
    @Size(max = 50, message = "Range per charge or tank must not exceed 50 characters")
    String rangePerChargeOrTank;

    @NotNull(message = "Location is required")
    @Valid
    CarLocationRequestDTO location;
}

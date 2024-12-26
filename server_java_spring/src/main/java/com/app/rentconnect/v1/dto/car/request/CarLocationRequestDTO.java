package com.app.rentconnect.v1.dto.car.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CarLocationRequestDTO {

    @NotBlank(message = "Address line cannot be blank")
    @Size(max = 255, message = "Address line must not exceed 255 characters")
    String addressLine;

    @NotBlank(message = "Province cannot be blank")
    @Size(max = 100, message = "Province must not exceed 100 characters")
    String province;

    @NotBlank(message = "District cannot be blank")
    @Size(max = 100, message = "District must not exceed 100 characters")
    String district;

    @NotBlank(message = "Ward cannot be blank")
    @Size(max = 100, message = "Ward must not exceed 100 characters")
    String ward;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude must be between -90 and 90")
    BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude must be between -180 and 180")
    BigDecimal longitude;
}

package com.app.rentconnect.dto.request;

import com.app.rentconnect.entity.Amenity;
import com.app.rentconnect.entity.Car;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CarAmenityRequestDTO {
    Long id;
    CarRequestDTO car;
    AmenityRequestDTO amenity;
}

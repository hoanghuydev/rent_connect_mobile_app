package com.app.rentconnect.v1.dto.request;
import com.app.rentconnect.v1.entity.Car;
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

public class CarImageRequestDTO {
    Long imageId;
    Car car;
    String imageUrl;
    LocalDateTime deletedAt;
}

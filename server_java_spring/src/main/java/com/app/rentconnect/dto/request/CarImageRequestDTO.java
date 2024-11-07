package com.app.rentconnect.dto.request;
import com.app.rentconnect.entity.Car;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

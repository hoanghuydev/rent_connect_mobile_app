package com.app.rentconnect.v1.dto.request;
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

public class CarFeatureRequestDTO {
    private List<CarFeatureMapRequestDTO> featureMaps;
    Long featureId;
    String featureName;
    LocalDateTime deletedAt;
}

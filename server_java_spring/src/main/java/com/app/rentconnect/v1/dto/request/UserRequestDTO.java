package com.app.rentconnect.v1.dto.request;
import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.car.request.CarRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class UserRequestDTO {
    Long userId;
    String fullName;
    String email;
    String phoneNumber;
    Constants.Role role;
    LocalDateTime createdAt = LocalDateTime.now();
    Boolean verified = false;
    Constants.LoginPlatform loginPlatform;
    String platformId;
    String token;
    LocalDateTime deletedAt;
}

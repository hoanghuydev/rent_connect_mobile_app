package com.app.rentconnect.v1.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class OtpVerificationRequestDTO {
    Long otpId;
    UserRequestDTO user;
    String otpCode;
    LocalDateTime expiresAt;
}

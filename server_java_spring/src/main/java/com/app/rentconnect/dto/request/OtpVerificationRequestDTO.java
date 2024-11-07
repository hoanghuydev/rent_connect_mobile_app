package com.app.rentconnect.dto.request;

import com.app.rentconnect.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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

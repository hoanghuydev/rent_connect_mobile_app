package com.app.rentconnect.v1.dto.user.response;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.entity.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDTO {
    Set<Role> roles;
    Long userId;
    String fullName;
    String email;
    String phoneNumber;
    LocalDateTime createdAt = LocalDateTime.now();
    LocalDateTime updatedAt = LocalDateTime.now();
    Boolean verified = false;
    Constants.LoginPlatform loginPlatform = Constants.LoginPlatform.EMAIL;
    String platformId;
    LocalDateTime deletedAt;
}

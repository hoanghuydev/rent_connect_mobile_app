package com.app.rentconnect.v1.dto.auth.response;

import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    UserRequestDTO user;
    String token;
}

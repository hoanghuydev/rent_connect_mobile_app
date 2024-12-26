package com.app.rentconnect.v1.dto.auth.request;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class LoginRequestDTO {
    @NotBlank(message = "Email must not be empty")
    @Email(message = "Invalid email format")
    String email;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{6,}$",
            message = "Password must contain at least one uppercase letter, one number, and be at least 6 characters long")
    String password;
}
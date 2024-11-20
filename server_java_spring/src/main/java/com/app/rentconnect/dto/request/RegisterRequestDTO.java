package com.app.rentconnect.dto.request;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterRequestDTO {
    @NotEmpty(message = "Full name cannot be empty")
    String fullName;

    @NotBlank(message = "Email must not be empty")
    @Email(message = "Invalid email format")
    String email;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{6,}$",
            message = "Password must contain at least one uppercase letter, one number, and be at least 6 characters long")
    String password;

    @Pattern(regexp = "^(1\\s?)?(\\d{3}|\\(\\d{3}\\))[\\s\\-]?\\d{3}[\\s\\-]?\\d{4}$",
            message = "Invalid phone number")
    String phoneNumber;
}
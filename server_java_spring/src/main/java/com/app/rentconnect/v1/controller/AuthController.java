package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.auth.request.LoginRequestDTO;
import com.app.rentconnect.v1.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.v1.dto.auth.request.VertifyRequestDTO;
import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.dto.auth.response.LoginResponse;
import com.app.rentconnect.v1.service.command.AuthCommandService;
import com.app.rentconnect.v1.service.query.AuthQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthController {
    AuthCommandService authCommandService;
    AuthQueryService authQueryService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserRequestDTO>> registerCustomer(@RequestBody RegisterRequestDTO registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                HttpStatus.CREATED,
                                "Register successfully. You need to verify your account to login",
                                "user",
                                authCommandService.registerUser(registerRequest)
                        )
                );
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody VertifyRequestDTO vertifyRequestDTO) {
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "OTP verified successfully", "email", authCommandService.verify(vertifyRequestDTO)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new ApiResponse<>(HttpStatus.ACCEPTED,"Logged in","data",authQueryService.login(loginRequestDTO)));
    }

}

package com.app.rentconnect.controller;

import com.app.rentconnect.dto.auth.request.LoginRequestDTO;
import com.app.rentconnect.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.dto.auth.request.VertifyRequestDTO;
import com.app.rentconnect.dto.request.*;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.dto.auth.response.LoginResponse;
import com.app.rentconnect.service.command.AuthCommandService;
import com.app.rentconnect.service.query.AuthQueryService;
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

    @PostMapping("/customers/register")
    public ResponseEntity<ApiResponse<UserRequestDTO>> registerCustomer(@RequestBody RegisterRequestDTO registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authCommandService.registerUser(registerRequest));
    }

//    Document authentication sections will be added later
    @PostMapping("/owners/register")
    public ResponseEntity<ApiResponse<UserRequestDTO>> registerOwner(@RequestBody RegisterRequestDTO registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authCommandService.registerUserAsOwner(registerRequest));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody VertifyRequestDTO vertifyRequestDTO) {
        return ResponseEntity.ok(authCommandService.verify(vertifyRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(authQueryService.login(loginRequestDTO));
    }

}

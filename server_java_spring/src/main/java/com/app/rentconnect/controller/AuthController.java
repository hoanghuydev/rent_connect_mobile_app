package com.app.rentconnect.controller;

import com.app.rentconnect.dto.request.*;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.dto.response.LoginResponse;
import com.app.rentconnect.service.command.AuthCommandService;
import com.app.rentconnect.service.query.AuthQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
    public ApiResponse<UserRequestDTO> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        return authCommandService.registerUser(registerRequest);
    }


    @PostMapping("/vertify")
    public ApiResponse<String> vertifyWithOtp(@RequestBody VertifyRequestDTO vertifyRequestDTO) {
        return authCommandService.vertify(vertifyRequestDTO);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> authenticateUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        return authQueryService.login(loginRequestDTO);
    }



}

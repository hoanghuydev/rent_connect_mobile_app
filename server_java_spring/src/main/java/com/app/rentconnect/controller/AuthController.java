package com.app.rentconnect.controller;

import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.request.*;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.dto.response.LoginResponse;
import com.app.rentconnect.entity.BookingHistory;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.repository.UserRepository;
import com.app.rentconnect.service.AuthService;
import com.app.rentconnect.service.OtpService;
import com.app.rentconnect.service.UserService;
import com.app.rentconnect.util.JwtUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthController {
    AuthService authService;

    @PostMapping("/register")
    public ApiResponse<UserRequestDTO> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        return authService.registerUser(registerRequest);
    }


    @PostMapping("/vertify")
    public ApiResponse<String> vertifyWithOtp(@RequestBody VertifyRequestDTO vertifyRequestDTO) {
        return authService.vertify(vertifyRequestDTO);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> authenticateUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        return authService.login(loginRequestDTO);
    }



}

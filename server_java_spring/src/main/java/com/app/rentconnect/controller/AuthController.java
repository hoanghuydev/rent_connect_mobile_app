package com.app.rentconnect.controller;

import com.app.rentconnect.dto.request.RegisterRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthController {
    UserService userService;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ApiResponse<UserRequestDTO> register(RegisterRequestDTO registerRequestDTO) {
        if (userService.existsByEmail(registerRequestDTO.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists.");
        }
        User user = userMapper.registerDTOtoEntity(registerRequestDTO);
        UserRequestDTO userRequestDTO = userMapper.toRequestDTO(userService.save(user));
        return new ApiResponse<>(
                HttpStatus.CREATED,
                "User registered successfully",
                "user",
                userRequestDTO
        );
    }

}

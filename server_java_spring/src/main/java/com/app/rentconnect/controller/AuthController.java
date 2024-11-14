package com.app.rentconnect.controller;

import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.request.LoginRequestDTO;
import com.app.rentconnect.dto.request.RegisterRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.dto.response.LoginResponse;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.repository.UserRepository;
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
    UserService userService;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    AuthenticationManager authenticationManager;
    JwtUtil jwtUtil;

    @PostMapping("/register")
    public ApiResponse<UserRequestDTO> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists.");
        }
        User user = userMapper.registerDTOtoEntity(registerRequest);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        UserRequestDTO userResponse = userMapper.toRequestDTO(userService.save(user));
        ApiResponse<UserRequestDTO> apiResponse = new ApiResponse<>(HttpStatus.CREATED,"Create user successfully","user",userResponse);
        return apiResponse;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> authenticateUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getEmail(),
                            loginRequestDTO.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            LoginResponse loginResponse = new LoginResponse(userDetails.getUsername(),jwt);
            return new ApiResponse<LoginResponse>(HttpStatus.ACCEPTED,"Logged in","user",loginResponse);

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

}

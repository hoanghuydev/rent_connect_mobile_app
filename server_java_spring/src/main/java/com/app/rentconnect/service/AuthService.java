package com.app.rentconnect.service;

import com.app.rentconnect.dto.request.*;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.dto.response.LoginResponse;
import com.app.rentconnect.entity.OtpVerification;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.util.JwtUtil;
import com.app.rentconnect.util.OtpEncryptionUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserService userService;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authenticationManager;
    JwtUtil jwtUtil;
    OtpService otpService;
    OtpEncryptionUtil otpEncryptionUtil;

    public ApiResponse<UserRequestDTO> registerUser(RegisterRequestDTO registerRequest) {
        try {
            if (userService.existsByEmail(registerRequest.getEmail())) {
                throw new IllegalArgumentException("User with this email already exists.");
            }
            User user = userMapper.registerDTOtoEntity(registerRequest);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            UserRequestDTO userResponse = userMapper.toRequestDTO(userService.save(user));
            otpService.sendOtp(new EmailRequestDTO(userResponse.getEmail()));
            return new ApiResponse<>(HttpStatus.CREATED,"Register successfully. You need vertify your account to login","user",userResponse);
        } catch (Exception e) {
            throw new RuntimeException("Error when register");
        }

    }


    public ApiResponse<String> vertify(VertifyRequestDTO vertifyRequestDTO) {
        OtpVerification otpVerification = otpService.findByEmail(vertifyRequestDTO.getEmail());
        try {
            String decryptedOtp = otpEncryptionUtil.decrypt(otpVerification.getOtpCode());
            if (!decryptedOtp.equals(vertifyRequestDTO.getOtpCode())) {
                throw new IllegalArgumentException("Invalid OTP");
            }
            return new ApiResponse<>(HttpStatus.OK, "OTP verified successfully", "email", vertifyRequestDTO.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Error verifying OTP", e);
        }
    }

    public ApiResponse<LoginResponse> login(LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getEmail(),
                            loginRequestDTO.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserRequestDTO user = userMapper.toRequestDTO(userService.findByEmail(userDetails.getUsername()));
            String jwt = jwtUtil.generateToken(userDetails);
            LoginResponse loginResponse = new LoginResponse(user,jwt);
            return new ApiResponse<LoginResponse>(HttpStatus.ACCEPTED,"Logged in","user",loginResponse);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }
}

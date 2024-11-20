package com.app.rentconnect.service.command;

import com.app.rentconnect.dto.request.*;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.entity.OtpVerification;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.service.query.OtpQueryService;
import com.app.rentconnect.service.query.UserQueryService;
import com.app.rentconnect.util.OtpEncryptionUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthCommandService {
    UserQueryService userQueryService;
    UserCommandService userCommandService;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    OtpCommandService otpCommandService;
    OtpEncryptionUtil otpEncryptionUtil;
    OtpQueryService otpQueryService;

    public ApiResponse<UserRequestDTO> registerUser(RegisterRequestDTO registerRequest) {
        try {
            if (userQueryService.existsByEmail(registerRequest.getEmail())) {
                throw new IllegalArgumentException("User with this email already exists.");
            }
            User user = userMapper.registerDTOtoEntity(registerRequest);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            UserRequestDTO userResponse = userMapper.toRequestDTO(userCommandService.save(user));
            otpCommandService.sendOtp(new EmailRequestDTO(userResponse.getEmail()));
            return new ApiResponse<>(HttpStatus.CREATED,"Register successfully. You need vertify your account to login","user",userResponse);
        } catch (Exception e) {
            throw new RuntimeException("Error when register");
        }
    }

    public ApiResponse<String> vertify(VertifyRequestDTO vertifyRequestDTO) {
        OtpVerification otpVerification = otpQueryService.findByEmail(vertifyRequestDTO.getEmail());
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
}

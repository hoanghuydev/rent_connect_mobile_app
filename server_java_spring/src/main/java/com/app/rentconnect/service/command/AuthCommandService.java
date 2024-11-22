package com.app.rentconnect.service.command;

import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.dto.auth.request.VertifyRequestDTO;
import com.app.rentconnect.dto.otp.request.SendOtpRequestDTO;
import com.app.rentconnect.dto.request.*;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.entity.OtpVerification;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.service.query.OtpQueryService;
import com.app.rentconnect.service.query.UserQueryService;
import com.app.rentconnect.util.OtpEncryptionUtil;
import jakarta.transaction.Transactional;
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

    @Transactional
    public ApiResponse<UserRequestDTO> registerUser(RegisterRequestDTO registerRequest) {
        validateEmailAvailability(registerRequest.getEmail());

        User user = userMapper.registerDTOtoEntity(registerRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userCommandService.save(user);
        otpCommandService.sendOtp(new SendOtpRequestDTO(savedUser.getEmail()));
        UserRequestDTO userResponse = userMapper.toRequestDTO(savedUser);
        return new ApiResponse<>(HttpStatus.CREATED, "Register successfully. You need to verify your account to login", "user", userResponse);
    }

    @Transactional
    public ApiResponse<UserRequestDTO> registerUserAsOwner(RegisterRequestDTO registerRequest) {
        validateEmailAvailability(registerRequest.getEmail());

        User user = userMapper.registerDTOtoEntity(registerRequest);
        user.setUserType(Constants.UserType.owner);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userCommandService.save(user);
        otpCommandService.sendOtp(new SendOtpRequestDTO(savedUser.getEmail()));
        UserRequestDTO userResponse = userMapper.toRequestDTO(savedUser);
        return new ApiResponse<>(HttpStatus.CREATED, "Register successfully. You need to verify your account to login", "user", userResponse);

    }

    public ApiResponse<String> verify(VertifyRequestDTO vertifyRequestDTO) {
        OtpVerification otpVerification = otpQueryService.findByUserEmail(vertifyRequestDTO.getEmail());
        verifyOtpCode(otpVerification, vertifyRequestDTO.getOtpCode());
        userCommandService.verifyByEmail(vertifyRequestDTO.getEmail(), true);

        return new ApiResponse<>(HttpStatus.OK, "OTP verified successfully", "email", vertifyRequestDTO.getEmail());
    }

    private void validateEmailAvailability(String email) {
        if (userQueryService.existsByEmail(email)) {
            throw new IllegalArgumentException("User with this email already exists.");
        }
    }

    private void verifyOtpCode(OtpVerification otpVerification, String inputOtp) {
        try {
            String decryptedOtp = otpEncryptionUtil.decrypt(otpVerification.getOtpCode());
            if (!decryptedOtp.equals(inputOtp)) {
                throw new IllegalArgumentException("Invalid OTP");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verifying OTP", e);
        }
    }
}

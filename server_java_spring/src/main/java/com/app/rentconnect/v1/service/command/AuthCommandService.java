package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.v1.dto.auth.request.VertifyRequestDTO;
import com.app.rentconnect.v1.dto.otp.request.SendOtpRequestDTO;
import com.app.rentconnect.v1.entity.OtpVerification;
import com.app.rentconnect.v1.entity.Role;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.service.query.OtpQueryService;
import com.app.rentconnect.v1.service.query.RoleQueryService;
import com.app.rentconnect.v1.service.query.UserQueryService;
import com.app.rentconnect.v1.util.OtpEncryptionUtil;
import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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
    RoleQueryService roleQueryService;

    @Transactional
    public UserRequestDTO registerUser(RegisterRequestDTO registerRequest) {
        validateEmailAvailability(registerRequest.getEmail());

        //Build user
        User user = userMapper.registerDTOtoEntity(registerRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);

        // Assign customer role
        Set<Role> roles = new HashSet<>();
        Role customerRole = roleQueryService.findByRoleName(Constants.Role.CUSTOMER.getValue());
        roles.add(customerRole);
        user.setRoles(roles);

        // Set platform
        user.setLoginPlatform(Constants.LoginPlatform.EMAIL);

        //Save user
        User savedUser = userCommandService.save(user);
        //Send otp mail
        otpCommandService.sendOtp(new SendOtpRequestDTO(savedUser.getEmail()));
        UserRequestDTO userResponse = userMapper.toRequestDTO(savedUser);
        return userResponse;
    }

    public String verify(VertifyRequestDTO vertifyRequestDTO) {
        OtpVerification otpVerification = otpQueryService.findByUserEmail(vertifyRequestDTO.getEmail());
        verifyOtpCode(otpVerification, vertifyRequestDTO.getOtpCode());
        userCommandService.verifyByEmail(vertifyRequestDTO.getEmail(), true);
        return vertifyRequestDTO.getEmail();
    }

    private void validateEmailAvailability(String email) {
        if (userQueryService.existsByEmail(email))
            throw new IllegalArgumentException("Email already exists");
    }

    private void verifyOtpCode(OtpVerification otpVerification, String inputOtp) {
        try {
            String decryptedOtp = otpEncryptionUtil.decrypt(otpVerification.getOtpCode());
            if (!decryptedOtp.equals(inputOtp))
                throw new IllegalArgumentException("Invalid OTP");
            if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now()))
                throw new IllegalArgumentException("OTP has expired");
        } catch (Exception e) {
            throw new RuntimeException("Error verifying OTP", e);
        }
    }
}

package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.auth.request.LoginRequestDTO;
import com.app.rentconnect.v1.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.v1.dto.auth.request.VertifyRequestDTO;
import com.app.rentconnect.v1.dto.auth.response.LoginResponse;
import com.app.rentconnect.v1.dto.otp.request.SendOtpRequestDTO;
import com.app.rentconnect.v1.entity.OtpVerification;
import com.app.rentconnect.v1.entity.Role;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.service.query.OtpQueryService;
import com.app.rentconnect.v1.service.query.RoleQueryService;
import com.app.rentconnect.v1.service.query.UserDetailsQueryService;
import com.app.rentconnect.v1.service.query.UserQueryService;
import com.app.rentconnect.v1.util.JwtUtil;
import com.app.rentconnect.v1.util.OtpEncryptionUtil;
import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.nimbusds.jose.JOSEException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
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
    AuthenticationManager authenticationManager;
    JwtUtil jwtUtil;
    UserMapper userMapper;
    UserQueryService userQueryService;
    UserCommandService userCommandService;
    PasswordEncoder passwordEncoder;
    OtpCommandService otpCommandService;
    OtpEncryptionUtil otpEncryptionUtil;
    OtpQueryService otpQueryService;
    RoleQueryService roleQueryService;
    private final UserDetailsQueryService userDetailsQueryService;

    @Transactional
    public UserRequestDTO registerUser(RegisterRequestDTO registerRequest) {
        validateEmailAvailability(registerRequest.getEmail());

        //Build user
        User user = userMapper.registerDTOtoEntity(registerRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);

        // Assign customer role
        Set<Role> roles = new HashSet<>();
        Role customerRole = roleQueryService.findByRoleName(Constants.Role.CUSTOMER.name());
        roles.add(customerRole);
        user.setRoles(roles);

        // Set platform
        user.setLoginPlatform(Constants.LoginPlatform.EMAIL);

        //Save user
        User savedUser = userCommandService.save(user);
        //Send otp mail
        //otpCommandService.sendOtp(new SendOtpRequestDTO(savedUser.getEmail()));
        UserRequestDTO userResponse = userMapper.toRequestDTO(savedUser);
        return userResponse;
    }

    public String verify(VertifyRequestDTO vertifyRequestDTO) {
        OtpVerification otpVerification = otpQueryService.findByUserEmail(vertifyRequestDTO.getEmail());
        verifyOtpCode(otpVerification, vertifyRequestDTO.getOtpCode());
        userCommandService.verifyByEmail(vertifyRequestDTO.getEmail(), true);
        return vertifyRequestDTO.getEmail();
    }

    public LoginResponse login(LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getEmail(),
                            loginRequestDTO.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserRequestDTO user = userMapper.toRequestDTO(userQueryService.findByEmailAndVerify(userDetails.getUsername(),true));
            String jwt = jwtUtil.generateToken(userDetails);
            LoginResponse loginResponse = new LoginResponse(user,jwt);
            return loginResponse;
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        } catch (JOSEException e) {
            throw new RuntimeException();
        }
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

package com.app.rentconnect.service;

import com.app.rentconnect.dto.request.EmailRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.entity.OtpVerification;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.repository.OtpRepository;
import com.app.rentconnect.util.OtpEncryptionUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class OtpService {
    OtpRepository otpRepository;
    OtpEncryptionUtil otpEncryptionUtil;
    UserService userService;
    MailService mailService;

    public String generateOtp(int length) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10)); // Chỉ lấy số từ 0-9
        }
        return otp.toString();
    }
    public OtpVerification findByEmail(String email)
    {
        return otpRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("OTP not found or expired"));
    }
    public ApiResponse<String> sendOtp(EmailRequestDTO emailRequestDTO) {
        try {
            String email = emailRequestDTO.getEmail();
            User user = userService.findByEmail(email);

            OtpVerification existingOtp = otpRepository.findByEmail(email).orElse(null);
            if (existingOtp != null) {
                LocalDateTime createdAt = existingOtp.getExpiresAt().minusMinutes(5);
                if (createdAt.isAfter(LocalDateTime.now().minusMinutes(1))) {
                    return new ApiResponse<>(HttpStatus.TOO_MANY_REQUESTS, "OTP already sent recently. Please wait for 1 minute.", "email", email);
                }
                String newOtp = generateOtp(6);
                String encryptedOtp = otpEncryptionUtil.encrypt(newOtp);
                existingOtp.setOtpCode(encryptedOtp);
                existingOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
                otpRepository.save(existingOtp);

                System.out.println("Updated OTP: " + newOtp);
                mailService.sendMailOTP(email, newOtp, user.getFullName());

                return new ApiResponse<>(HttpStatus.OK, "Send OTP successfully. OTP will expire in 5 minutes.", "email", email);
            }

            String randomOtp = generateOtp(6);
            String encryptedOtp = otpEncryptionUtil.encrypt(randomOtp);

            OtpVerification otpVerification = OtpVerification.builder()
                    .otpCode(encryptedOtp)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusMinutes(5))
                    .build();
            System.out.println("OTP: "+randomOtp);

            mailService.sendMailOTP(email, randomOtp, user.getFullName());
            otpRepository.save(otpVerification);

            return new ApiResponse<>(HttpStatus.CREATED, "Resend otp successfully. OTP will expire in 5 minutes", "email", email);
        } catch (Exception e) {
            throw new RuntimeException("Error generating OTP", e);
        }
    }

}

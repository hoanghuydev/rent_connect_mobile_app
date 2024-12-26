package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.otp.request.SendOtpRequestDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.entity.OtpVerification;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.repository.OtpRepository;
import com.app.rentconnect.v1.service.query.UserQueryService;
import com.app.rentconnect.v1.util.OtpEncryptionUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpCommandService {
    static final Logger logger = LoggerFactory.getLogger(OtpCommandService.class);
    OtpRepository otpRepository;
    OtpEncryptionUtil otpEncryptionUtil;
    UserQueryService userQueryService;
    MailCommandService mailCommandService;

    public String sendOtp(SendOtpRequestDTO sendOtpRequestDTO) {
        try {
            String email = sendOtpRequestDTO.getEmail();
            User user = userQueryService.findByEmailAndVerify(email,false);

            OtpVerification existingOtp = otpRepository.findByUserEmail(email).orElse(null);
            if (existingOtp != null) {
                LocalDateTime createdAt = existingOtp.getExpiresAt().minusMinutes(5);
                if (createdAt.isAfter(LocalDateTime.now().minusMinutes(1))) {
                    return "OTP already sent recently. Please wait for 1 minute.";
                }
                updateExistingOtp(existingOtp, user);
                return "Send OTP successfully. OTP will expire in 5 minutes.";
            }

            createNewOtp(user);
            return "Resend OTP successfully. OTP will expire in 5 minutes.";
        } catch (Exception e) {
            throw new RuntimeException("Error generating OTP", e);
        }
    }

    private void createNewOtp(User user) throws Exception {
        String randomOtp = generateOtp(6);
        String encryptedOtp = otpEncryptionUtil.encrypt(randomOtp);
        logger.info("Generated OTP for user {}: {}", user.getEmail(), randomOtp);
        OtpVerification otpVerification = OtpVerification.builder()
                .otpCode(encryptedOtp)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();
        otpRepository.save(otpVerification);
        mailCommandService.sendMailOTP(user.getEmail(), randomOtp, user.getFullName());
    }

    private void updateExistingOtp(OtpVerification existingOtp, User user) throws Exception {
        String newOtp = generateOtp(6);
        String encryptedOtp = otpEncryptionUtil.encrypt(newOtp);
        logger.info("Generated OTP for user {}: {}", user.getEmail(), newOtp);
        existingOtp.setOtpCode(encryptedOtp);
        existingOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(existingOtp);

        mailCommandService.sendMailOTP(user.getEmail(), newOtp, user.getFullName());
    }

    private String generateOtp(int length) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10)); // Chỉ lấy số từ 0-9
        }
        return otp.toString();
    }
}

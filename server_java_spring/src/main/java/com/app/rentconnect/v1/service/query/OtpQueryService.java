package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.entity.OtpVerification;
import com.app.rentconnect.v1.repository.OtpRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpQueryService {
    OtpRepository otpRepository;
    public OtpVerification findByUserEmail(String email) {
        return otpRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("OTP not found or expired"));
    }
}

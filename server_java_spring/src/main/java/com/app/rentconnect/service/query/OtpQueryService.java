package com.app.rentconnect.service.query;

import com.app.rentconnect.entity.OtpVerification;
import com.app.rentconnect.repository.OtpRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpQueryService {
    OtpRepository otpRepository;
    public OtpVerification findByEmail(String email) {
        return otpRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("OTP not found or expired"));
    }
}

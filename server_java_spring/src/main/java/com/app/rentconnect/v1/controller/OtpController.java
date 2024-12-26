package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.otp.request.SendOtpRequestDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.OtpCommandService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/otp")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OtpController {
    OtpCommandService otpCommandService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestBody SendOtpRequestDTO sendOtpRequestDTO) {
        String msgResp = otpCommandService.sendOtp(sendOtpRequestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK, otpCommandService.sendOtp(sendOtpRequestDTO), null,null));
    }

}

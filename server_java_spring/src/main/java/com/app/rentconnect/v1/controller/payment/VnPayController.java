package com.app.rentconnect.v1.controller.payment;

import com.app.rentconnect.v1.dto.payment.vnpay.response.VnpayCallbackResponse;
import com.app.rentconnect.v1.dto.payment.vnpay.response.VnpayPaymentResponse;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.service.command.RentalCommandService;
import com.app.rentconnect.v1.service.command.VnPayCommandService;
import com.app.rentconnect.v1.util.VnpayUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.query.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment/vnpay")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class VnPayController {

    VnPayCommandService vnPayCommandService;
    RentalCommandService rentalCommandService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<VnpayPaymentResponse>> createUrlPayment(@RequestParam(required = false) Long rentalId) {
        VnpayPaymentResponse vnpayPaymentResponse = vnPayCommandService.createPayment(rentalId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                HttpStatus.CREATED,
                                "Created payment",
                                "payment",
                                vnpayPaymentResponse
                        )
                );

    }

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<VnpayCallbackResponse>> paymentCallback(@RequestParam Map<String, String> requestParams) {
        VnpayCallbackResponse callbackResponse = vnPayCommandService.verifyPaymentCallback(requestParams);
        if ("00".equals(callbackResponse.getResponseCode())) {
            rentalCommandService.updateRentPaid(Long.valueOf(callbackResponse.getRentalId()),true);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(
                            new ApiResponse<>(
                                    HttpStatus.CREATED,
                                    "Payment successfully",
                                    "payment",
                                    callbackResponse
                            )
                    );
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(
                            new ApiResponse<>(
                                    HttpStatus.CREATED,
                                    "error",
                                    "payment",
                                    callbackResponse
                            )
                    );
        }

    }
}

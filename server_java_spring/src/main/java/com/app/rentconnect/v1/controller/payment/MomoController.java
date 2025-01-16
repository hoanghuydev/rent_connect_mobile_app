package com.app.rentconnect.v1.controller.payment;

import com.app.rentconnect.v1.dto.payment.momo.response.MomoPaymentResponse;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.MomoCommandService;
import com.app.rentconnect.v1.service.command.SocketCommandService;
import com.cloudinary.Api;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/v1/payment/momo")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MomoController {
   MomoCommandService momoCommandService;
   SocketCommandService socketCommandService;

    @PostMapping("/rental/{rentalId}")
    public ResponseEntity<ApiResponse<String>> initiatePayment(@PathVariable Long rentalId) {
        MomoPaymentResponse response = momoCommandService.initiatePayment(rentalId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                HttpStatus.CREATED,
                                "create payment momo success",
                                "url",
                                response.getPayUrl()
                        )
                );
    }

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<Boolean>> handleCallback(
            @RequestParam String orderId,
            @RequestParam String partnerCode,
            @RequestParam String requestId) {

        boolean isSuccess = momoCommandService.verifyPayment(orderId, requestId, partnerCode);
        socketCommandService.sendMessageRentalInfo(Long.valueOf(orderId));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                HttpStatus.CREATED,
                                "create payment momo success",
                                "paid",
                                isSuccess

                        )
                );
    }
}

package com.app.rentconnect.v1.dto.payment.vnpay.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VnpayPaymentResponse {
    private String paymentUrl;
    private String message;
    private boolean success;
}
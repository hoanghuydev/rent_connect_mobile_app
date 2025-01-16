package com.app.rentconnect.v1.dto.payment.momo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MomoPaymentResponse {
    private String payUrl;
}
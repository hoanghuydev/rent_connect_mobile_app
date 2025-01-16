package com.app.rentconnect.v1.dto.payment.vnpay.response;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class VnpayCallbackResponse {
    private String rentalId;
    private String transactionNo;
    private String responseCode;
    private String secureHash;
    private Long amount;
    private Map<String, String> rawParams;
}
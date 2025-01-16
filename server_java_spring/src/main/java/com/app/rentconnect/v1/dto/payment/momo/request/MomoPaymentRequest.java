package com.app.rentconnect.v1.dto.payment.momo.request;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MomoPaymentRequest {
    private String requestId;
    private String orderId;
    private String amount;
    private String orderInfo;
    private String redirectUrl;
    private String ipnUrl;
    private String requestType;
    private String extraData;
}
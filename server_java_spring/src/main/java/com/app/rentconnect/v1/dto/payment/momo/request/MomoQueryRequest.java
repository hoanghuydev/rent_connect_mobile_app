package com.app.rentconnect.v1.dto.payment.momo.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MomoQueryRequest {
    private String partnerCode;
    private String requestId;
    private Long rentalId;
    private String signature;
    private String lang;
}
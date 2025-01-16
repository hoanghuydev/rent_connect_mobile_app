package com.app.rentconnect.v1.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VnpayConfig {
    public String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    @Value("${vnpay.returnUrl}")
    public String vnp_ReturnUrl;

    @Value("${vnpay.tmnCode}")
    public String vnp_TmnCode;

    public String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    @Value("${vnpay.secretKey}")
    public String vnp_HashSecret;
}

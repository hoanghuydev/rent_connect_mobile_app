package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.configuration.MomoConfig;
import com.app.rentconnect.v1.dto.payment.momo.request.MomoPaymentRequest;
import com.app.rentconnect.v1.dto.payment.momo.request.MomoQueryRequest;
import com.app.rentconnect.v1.dto.payment.momo.response.MomoPaymentResponse;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.repository.RentalRepository;
import com.app.rentconnect.v1.service.query.RentalQueryService;
import com.app.rentconnect.v1.util.HMACUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import net.minidev.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MomoCommandService {
    MomoConfig momoConfig;
    RentalQueryService rentalQueryService;
    private final RentalCommandService rentalCommandService;
    private final RentalRepository rentalRepository;

    public MomoPaymentResponse initiatePayment(Long rentalId) throws RuntimeException {
        try {
            Rental rental = rentalQueryService.findRentalById(rentalId);
            String requestId = "MOMO" + System.currentTimeMillis();
            String orderId = requestId;
            String redirectUrl = momoConfig.getRedirectUrl() + "/" + rental.getRentalId();
            BigDecimal totalPrice = rental.getTotalPrice();
            BigDecimal amountDecimal = totalPrice.multiply(BigDecimal.valueOf(1));
            int amount = amountDecimal.intValue();

            MomoPaymentRequest paymentRequest = MomoPaymentRequest.builder()
                    .requestId(requestId)
                    .orderId(orderId)
                    .amount(String.valueOf((int) (amount)))
                    .orderInfo(String.valueOf(rental.getRentalId()))
                    .redirectUrl(redirectUrl)
                    .ipnUrl(momoConfig.getIpnUrl() + "/" + rental.getRentalId())
                    .requestType("payWithATM")
                    .extraData("")
                    .build();

            String signature = generateSignature(paymentRequest);
            Map<String, Object> requestBody = createRequestBody(paymentRequest, signature);

            JSONObject jsonResult = HttpUtil.doPost(momoConfig.getCreateEndpoint(), requestBody, null);
            return MomoPaymentResponse.builder()
                    .payUrl(jsonResult.getString("payUrl"))
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to initiate Momo payment", e);
        }
    }

    public boolean verifyPayment(Long rentalId, String requestId, String partnerCode)
            throws RuntimeException {
        try {
            String rawSignature = String.format("accessKey=%s&orderId=%s&partnerCode=%s&requestId=%s",
                    momoConfig.getAccessKey(), rentalId, partnerCode, requestId);

            String signature = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256,
                    momoConfig.getSecretKey(), rawSignature);

            MomoQueryRequest queryRequest = MomoQueryRequest.builder()
                    .partnerCode(partnerCode)
                    .requestId(requestId)
                    .rentalId(rentalId)
                    .signature(signature)
                    .lang("en")
                    .build();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", queryRequest.getPartnerCode());
            requestBody.put("requestId", queryRequest.getRequestId());
            requestBody.put("orderId", queryRequest.getRentalId());
            requestBody.put("signature", queryRequest.getSignature());
            requestBody.put("lang", queryRequest.getLang());

            JSONObject jsonResult = HttpUtil.doPost(momoConfig.getQueryEndpoint(), requestBody, null);
            boolean isSuccess = jsonResult.getInt("resultCode") == 0;

            if (isSuccess) {
                Rental rental = rentalQueryService.findRentalById(rentalId);

                rental.setPaid(true);
                rentalRepository.save(rental);
            }

            return isSuccess;

        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Momo payment", e);
        }
    }

    private String generateSignature(MomoPaymentRequest request) throws Exception {
        String data = String.format("accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s" +
                        "&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                momoConfig.getAccessKey(),
                request.getAmount(),
                request.getExtraData(),
                request.getIpnUrl(),
                request.getOrderId(),
                request.getOrderInfo(),
                momoConfig.getPartnerCode(),
                request.getRedirectUrl(),
                request.getRequestId(),
                request.getRequestType());

        return HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, momoConfig.getSecretKey(), data);
    }

    private Map<String, Object> createRequestBody(MomoPaymentRequest request, String signature) {
        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", momoConfig.getPartnerCode());
        body.put("accessKey", momoConfig.getAccessKey());
        body.put("requestId", request.getRequestId());
        body.put("amount", request.getAmount());
        body.put("orderId", request.getOrderId());
        body.put("orderInfo", request.getOrderInfo());
        body.put("redirectUrl", request.getRedirectUrl());
        body.put("ipnUrl", request.getIpnUrl());
        body.put("extraData", request.getExtraData());
        body.put("requestType", request.getRequestType());
        body.put("signature", signature);
        body.put("lang", "en");
        return body;
    }
}

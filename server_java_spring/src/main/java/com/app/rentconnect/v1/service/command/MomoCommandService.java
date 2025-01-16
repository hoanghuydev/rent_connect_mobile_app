package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.configuration.MomoConfig;
import com.app.rentconnect.v1.dto.payment.momo.request.MomoPaymentRequest;
import com.app.rentconnect.v1.dto.payment.momo.request.MomoQueryRequest;
import com.app.rentconnect.v1.dto.payment.momo.response.MomoPaymentResponse;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.repository.RentalRepository;
import com.app.rentconnect.v1.service.query.RentalQueryService;
import com.app.rentconnect.v1.util.HMACUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MomoCommandService {
    private static final Logger logger = LoggerFactory.getLogger(MomoCommandService.class);
    private static final String PAYMENT_PREFIX = "MOMO";

    private final MomoConfig momoConfig;
    private final RentalQueryService rentalQueryService;
    private final RentalRepository rentalRepository;
    private final RestTemplate restTemplate;

    @Transactional
    public MomoPaymentResponse initiatePayment(Long rentalId) {
        try {
            Rental rental = getRentalOrThrow(rentalId);
            String requestId = PAYMENT_PREFIX + System.currentTimeMillis();
            String orderId = String.valueOf(rentalId);

            // Build raw data string exactly as in working example
            String redirectUrl = momoConfig.getRedirectUrl();
            String ipnUrl = momoConfig.getIpnUrl();
            String amount = String.valueOf(calculateAmount(rental.getTotalPrice()));

            // Construct signature data string in exact order
            String rawSignature = "accessKey=" + momoConfig.getAccessKey() +
                    "&amount=" + amount +
                    "&extraData=" + "" +
                    "&ipnUrl=" + ipnUrl +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderId +
                    "&partnerCode=" + momoConfig.getPartnerCode() +
                    "&redirectUrl=" + redirectUrl +
                    "&requestId=" + requestId +
                    "&requestType=payWithATM";

            // Generate signature
            String signature = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, momoConfig.getSecretKey(), rawSignature);

            // Create request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", momoConfig.getPartnerCode());
            requestBody.put("accessKey", momoConfig.getAccessKey());
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amount);
            requestBody.put("orderId", orderId);
            requestBody.put("orderInfo", orderId);
            requestBody.put("redirectUrl", redirectUrl);
            requestBody.put("ipnUrl", ipnUrl);
            requestBody.put("extraData", "");
            requestBody.put("requestType", "payWithATM");
            requestBody.put("signature", signature);
            requestBody.put("lang", "en");

            // Log for debugging
            logger.debug("Raw signature: {}", rawSignature);
            logger.debug("Generated signature: {}", signature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<JSONObject> response = restTemplate.postForEntity(
                    momoConfig.getCreateEndpoint(),
                    entity,
                    JSONObject.class
            );

            JSONObject jsonResult = Objects.requireNonNull(response.getBody());
            return MomoPaymentResponse.builder()
                    .payUrl(jsonResult.getAsString("payUrl"))
                    .build();

        } catch (Exception e) {
            logger.error("Failed to initiate Momo payment for rental {}: {}", rentalId, e.getMessage());
            throw new RuntimeException("Failed to initiate Momo payment", e);
        }
    }

    @Transactional
    public boolean verifyPayment(String orderId, String requestId, String partnerCode) {
        try {
            // Build signature exactly as in working example
            String rawSignature = "accessKey=" + momoConfig.getAccessKey() +
                    "&orderId=" + orderId +
                    "&partnerCode=" + partnerCode +
                    "&requestId=" + requestId;

            String signature = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, momoConfig.getSecretKey(), rawSignature);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", partnerCode);
            requestBody.put("requestId", requestId);
            requestBody.put("orderId", orderId);
            requestBody.put("signature", signature);
            requestBody.put("lang", "en");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<JSONObject> response = restTemplate.postForEntity(
                    momoConfig.getQueryEndpoint(),
                    entity,
                    JSONObject.class
            );

            JSONObject jsonResult = Objects.requireNonNull(response.getBody());
            boolean isSuccess = jsonResult.getAsNumber("resultCode").intValue() == 0;

            if (isSuccess) {
                Long rentalId = Long.parseLong(jsonResult.getAsString("orderId"));
                updateRentalPaymentStatus(rentalId);
            }

            return isSuccess;
        } catch (Exception e) {
            logger.error("Failed to verify Momo payment for order {}: {}", orderId, e.getMessage());
            throw new RuntimeException("Failed to verify Momo payment", e);
        }
    }

    private int calculateAmount(BigDecimal totalPrice) {
        return totalPrice.multiply(BigDecimal.ONE).intValue();
    }

    private void updateRentalPaymentStatus(Long rentalId) {
        Rental rental = getRentalOrThrow(rentalId);
        rental.setPaid(true);
        rentalRepository.save(rental);
    }

    private Rental getRentalOrThrow(Long rentalId) {
        return rentalQueryService.findRentalById(rentalId);
    }
}

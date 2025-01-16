package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.configuration.VnpayConfig;
import com.app.rentconnect.v1.dto.payment.vnpay.response.VnpayCallbackResponse;
import com.app.rentconnect.v1.dto.payment.vnpay.response.VnpayPaymentResponse;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.service.query.RentalQueryService;
import com.app.rentconnect.v1.util.VnpayUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.IdentityHashMap;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class VnPayCommandService {
    VnpayUtil vnpayUtil;
    VnpayConfig vnpayConfig;
    RentalQueryService rentalQueryService;

    public VnpayPaymentResponse createPayment(Long rentalId) {
        try {
            Rental rental = rentalQueryService.findRentalById(rentalId);
            Map<String, String> vnpParams = initializePaymentParams(rental);
            String queryUrl = buildQueryUrl(vnpParams);
            String paymentUrl = vnpayConfig.getVnp_ApiUrl() + "?" + queryUrl;
            return VnpayPaymentResponse.builder()
                    .success(true)
                    .paymentUrl(paymentUrl)
                    .message("Payment URL created successfully")
                    .build();

        } catch (Exception e) {
            return VnpayPaymentResponse.builder()
                    .success(false)
                    .message("Error creating payment: " + e.getMessage())
                    .build();
        }
    }


    private Map<String, String> initializePaymentParams(Rental rental) {
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String vnpTxnRef = VnpayUtil.getRandomNumber(8);
        BigDecimal totalPrice = rental.getTotalPrice();
        BigDecimal amountDecimal = totalPrice.multiply(BigDecimal.valueOf(100));
        int amount = amountDecimal.intValue();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpayConfig.getVnp_TmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", String.valueOf(rental.getRentalId()));
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpayConfig.getVnp_ReturnUrl());
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        setPaymentTimes(vnpParams);

        return vnpParams;
    }

    private void setPaymentTimes(Map<String, String> vnpParams) {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

        String vnpCreateDate = formatter.format(calendar.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        calendar.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(calendar.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);
    }

    private String buildQueryUrl(Map<String, String> vnpParams) {
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    buildHashAndQuery(fieldName, fieldValue, hashData, query, itr.hasNext());
                } catch (Exception e) {
                    throw new RuntimeException("Error building payment URL", e);
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = VnpayUtil.hmacSHA512(vnpayConfig.getVnp_HashSecret(), hashData.toString());
        return queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    private void buildHashAndQuery(String fieldName, String fieldValue, StringBuilder hashData,
                                   StringBuilder query, boolean hasNext) throws Exception {
        hashData.append(fieldName);
        hashData.append('=');
        hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

        query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
        query.append('=');
        query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

        if (hasNext) {
            query.append('&');
            hashData.append('&');
        }
    }

    public VnpayCallbackResponse verifyPaymentCallback(Map<String, String> requestParams) {
        // Create a mutable copy of the params for modification
        Map<String, String> fields = new IdentityHashMap<>(requestParams);

        String vnpSecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String signValue = VnpayUtil.hashAllFields(fields, vnpayConfig.getVnp_HashSecret());
        boolean isValidSignature = signValue.equals(vnpSecureHash);

        if (!isValidSignature) {
            throw new RuntimeException("Invalid payment signature");
        }

        return VnpayCallbackResponse.builder()
                .rentalId(fields.get("vnp_OrderInfo"))
                .transactionNo(fields.get("vnp_TransactionNo"))
                .responseCode(fields.get("vnp_ResponseCode"))
                .amount(Long.parseLong(fields.get("vnp_Amount")) / 100)
                .secureHash(vnpSecureHash)
                .rawParams(fields)
                .build();
    }


}

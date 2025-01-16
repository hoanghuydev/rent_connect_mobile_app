package com.app.rentconnect.v1.configuration;

import lombok.*;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "momo")
public class MomoConfig {
    private String accessKey;
    private String secretKey;
    private String partnerCode;
    private String baseUrl;
    private String createEndpoint;
    private String queryEndpoint;
    private String redirectUrl;
    private String ipnUrl;
}
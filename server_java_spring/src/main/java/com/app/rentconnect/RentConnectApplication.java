package com.app.rentconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.app.rentconnect.mapper", "com.app.rentconnect"})
public class RentConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentConnectApplication.class, args);
    }

}

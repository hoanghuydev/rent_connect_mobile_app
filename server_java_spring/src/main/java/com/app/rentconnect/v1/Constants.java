package com.app.rentconnect.v1;

import lombok.Getter;

public class Constants {

    @Getter
    public enum Role {
        CUSTOMER("CUSTOMER"),
        OWNER("OWNER"),
        ADMIN("ADMIN"),
        MODERATOR("MODERATOR"),
        SUPER_ADMIN("SUPER_ADMIN"),
        DRIVER("DRIVER");

        private final String value;

        Role(String value) {
            this.value = value;
        }
    }


    public enum LoginPlatform {
        EMAIL,
        GOOGLE,
        FACEBOOK,
        OTHER,

    }

    public enum RentalStatus {
        REQUESTED,
        APPROVED,
        REJECTED,
        COMPLETED,
        CANCELED
    }


    public enum AddressType {
        HOME,
        COMPANY ,
        OTHER,
    }

}

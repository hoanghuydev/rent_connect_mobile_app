package com.app.rentconnect.v1;

import lombok.Getter;

public class Constants {

    public enum Role {
        CUSTOMER,
        OWNER,
        ADMIN,
        MODERATOR,
        SUPER_ADMIN ,
        DRIVER,

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

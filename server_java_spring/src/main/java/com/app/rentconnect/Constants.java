package com.app.rentconnect;

public class Constants {
    public enum UserType {
        CUSTOMER, OWNER
    }

    public enum LoginPlatform {
        EMAIL, GOOGLE, FACEBOOK, OTHER
    }

    public enum RentalStatus {
        REQUESTED, APPROVED, REJECTED, COMPLETED, CANCELED
    }

    public enum AddressType {
        HOME, COMPANY, OTHER
    }
}

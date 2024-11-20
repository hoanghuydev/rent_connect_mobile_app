package com.app.rentconnect;

public class Constants {

    public enum UserType {
        admin,
        owner,
        customer
    }

    public enum LoginPlatform {
        email,
        google,
        facebook,
        other
    }

    public enum RentalStatus {
        requested,
        approved,
        rejected,
        completed,
        canceled
    }

    public enum AddressType {
        home,
        company,
        other
    }
}

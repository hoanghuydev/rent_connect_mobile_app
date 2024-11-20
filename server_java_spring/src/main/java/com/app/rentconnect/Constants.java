package com.app.rentconnect;

public class Constants {
    public static enum USER_TYPE{
        admin,
        owner,
        customer
    }
    public static enum LOGIN_PLATFORM {
        email,
        google,
        facebook,
        other
    }
    public static enum ADDRESS_TYPE {
        home,
        company,
        other
    }
    public static enum RENTAL_BOOKING_STATUS {
        requested,
        approved,
        rejected,
        completed,
        canceled
    }
}

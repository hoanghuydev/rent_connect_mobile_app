package com.app.rentconnect.v1.dto.auth.request;

import lombok.Data;

@Data
public class UserUpdateRequestDTO {
    private Long userId;
    private String fullName;
    private String phoneNumber;
    private String email;
}

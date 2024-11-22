package com.app.rentconnect.dto.request;
import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.car.request.CarRequestDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class UserRequestDTO {
    List<CarRequestDTO> cars;
    List<RentalRequestDTO> rentalsAsCustomer;
    List<RentalRequestDTO> rentalsAsOwner;
    List<MessageRequestDTO> messages;
    List<AddressRequestDTO> addresses;
    Long userId;
    String fullName;
    String email;
    String password;
    String phoneNumber;
    Constants.UserType userType;
    LocalDateTime createdAt = LocalDateTime.now();
    Boolean verified = false;
    Constants.LoginPlatform loginPlatform;
    String platformId;
    String token;
    LocalDateTime deletedAt;
}

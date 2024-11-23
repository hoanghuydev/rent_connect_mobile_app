package com.app.rentconnect.controller;

import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user/update")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UpdateUserInfoController {
    UserService userService;
    UserMapper userMapper;


    @PostMapping("/fullname")
    public ApiResponse<HttpStatus> updateUserFullName(@RequestParam String fullName){
        if (userService.updateFullName(fullName, "")){
            return new ApiResponse<>(HttpStatus.OK, "Update successfully",
                    "user",null);
        }
        else
            return new ApiResponse<>(HttpStatus.BAD_REQUEST, "Update failed",
                    "user",null);

    }

    @PostMapping("/user/email")
    public ApiResponse<UserRequestDTO> updateUserEmail(String email){
        if (userService.updateFullName(email, "")){
            return new ApiResponse<>(HttpStatus.OK, "Update successfully",
                    "user",null);
        }
        else
            return new ApiResponse<>(HttpStatus.BAD_REQUEST, "Update failed",
                    "user",null);
    }

    @PostMapping("/user/phonenumber")
    public ApiResponse<UserRequestDTO> updateUserPhoneNumber(String phoneNumber){
        if (userService.updateFullName(phoneNumber, "")){
            return new ApiResponse<>(HttpStatus.OK, "Update successfully",
                    "user",null);
        }
        else
            return new ApiResponse<>(HttpStatus.BAD_REQUEST, "Update failed",
                    "user",null);
    }
}

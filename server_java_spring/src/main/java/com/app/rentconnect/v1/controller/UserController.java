package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.AuthCommandService;
import com.app.rentconnect.v1.service.command.UserCommandService;
import com.app.rentconnect.v1.service.query.UserQueryService;
import com.cloudinary.Api;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.dto.user.response.UserResponseDTO;
import com.app.rentconnect.v1.entity.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserController {
    AuthCommandService authCommandService;
    UserCommandService userCommandService;
    UserQueryService userQueryService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UserRequestDTO>> createUser(@RequestBody RegisterRequestDTO registerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                HttpStatus.CREATED,
                                "Register successfully. You need to verify your account to login",
                                "user",
                                authCommandService.registerUser(registerRequest)
                        )
                );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<UserRequestDTO>>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        new ApiResponse<>(
                                HttpStatus.OK,
                                "find all user successfully",
                                "user",
                                userQueryService.getAll()
                        )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserRequestDTO>> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        new ApiResponse<>(
                                HttpStatus.OK,
                                "find user successfully",
                                "user",
                                userQueryService.findById(id)
                        )
                );
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<UserRequestDTO>> updateUser(@PathVariable("id") Long id, @RequestBody UserRequestDTO userRequest) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        new ApiResponse<>(
                                HttpStatus.ACCEPTED,
                                "Update successfully.",
                                "user",
                                userCommandService.updateUser(id, userRequest)
                        )
                );
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userCommandService.deleteUser(id);

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable("id") Long id) {
        ApiResponse<UserResponseDTO> apiResponse = new ApiResponse<>(HttpStatus.OK,"Get user successfully","user",userQueryService.findById(id));
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}

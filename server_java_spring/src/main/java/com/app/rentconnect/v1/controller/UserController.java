package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.dto.user.response.UserResponseDTO;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.service.command.UserCommandService;
import com.app.rentconnect.v1.service.query.UserQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserQueryService userQueryService;
    UserCommandService userCommandService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable("id") Long id) {
        ApiResponse<UserResponseDTO> apiResponse = new ApiResponse<>(HttpStatus.OK,"Get user successfully","user",userQueryService.findById(id));
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
        ApiResponse<List<UserResponseDTO>> list = new ApiResponse<>(HttpStatus.OK, "Get all successfully", "user", userQueryService.findAll());
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(@RequestBody UserRequestDTO userRequestDTO){
        UserResponseDTO userResponseDTO = userCommandService.update(userRequestDTO);

        if (userResponseDTO == null) {
            ApiResponse<UserResponseDTO> apiResponse =
                    new ApiResponse<>(HttpStatus.NOT_FOUND, "User not found or update failed", "user", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        }
        ApiResponse<UserResponseDTO> apiResponse =
                new ApiResponse<>(HttpStatus.OK,"Update user successfully","user",userResponseDTO);
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id){
        userCommandService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("User deleted");
    }
}

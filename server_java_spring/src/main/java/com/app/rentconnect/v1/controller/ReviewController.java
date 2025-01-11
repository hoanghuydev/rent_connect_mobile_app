package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.ReviewCommandService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewCommandService reviewCommandService;
    @PreAuthorize("hasRole(T(com.app.rentconnect.v1.Constants.Role).CUSTOMER.name())")
    @PostMapping("/car/{carId}")
    public ResponseEntity<ApiResponse<CarResponseDTO>> addCar(@PathVariable Long carId) {
        return null;
    }
}

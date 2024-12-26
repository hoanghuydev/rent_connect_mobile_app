package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.car.request.CarRequestDTO;
import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.CarCommandService;
import com.app.rentconnect.v1.service.query.CarQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarController {
    CarCommandService carCommandService;
    CarQueryService carQueryService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CarResponseDTO>> addCar(@RequestParam("images") List<MultipartFile> imageFiles, @RequestBody CreateCarRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED,"Create car successful","car",carCommandService.createCar(imageFiles, request)));
    }

    @PutMapping("/{carId}")
    public ResponseEntity<ApiResponse<CarRequestDTO>> updateCar(@PathVariable Long carId, @RequestBody CarRequestDTO request) {
        return null;
    }

    @GetMapping("/{carId}")
    public ResponseEntity<ApiResponse<CarRequestDTO>> getCarById(@PathVariable Long carId) {
       return null;
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long carId) {
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarRequestDTO>>> getAllCars(
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String province) {
       return null;
    }


}

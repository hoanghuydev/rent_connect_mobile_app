package com.app.rentconnect.controller;

import com.app.rentconnect.dto.car.request.CarRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.service.command.CarCommandService;
import com.app.rentconnect.service.query.CarQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cars/")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarController {
    CarCommandService carCommandService;
    CarQueryService carQueryService;

    @PostMapping
    public ResponseEntity<ApiResponse<CarRequestDTO>> addCar(@RequestBody CarRequestDTO request) {
        return null;
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

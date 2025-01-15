package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.entity.CarImage;
import com.app.rentconnect.v1.repository.CarImageRepository;
import com.app.rentconnect.v1.service.query.CarImageQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carImage")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarImageController {
    CarImageQueryService carImageQueryService;

    @GetMapping("/{carId}")
    public ResponseEntity<ApiResponse<List<String>>> getCarImagesByCarId(@PathVariable Long carId) {
        List<String> list = carImageQueryService.findAllByCarId(carId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(HttpStatus.OK, "Get images by car id", "carImage", list));
    }
    @GetMapping()
    public ResponseEntity<ApiResponse<List<String>>> getAll() {
        List<String> list = carImageQueryService.findAll();
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(HttpStatus.OK, "Get images by car id", "carImage", list));
    }

}

package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.car.request.CarRequestDTO;
import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.rental.request.RentalRequestDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.CarCommandService;
import com.app.rentconnect.v1.service.command.RentalCommandService;
import com.app.rentconnect.v1.service.query.CarQueryService;
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
@RequestMapping("/api/v1/car")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarController {
    CarCommandService carCommandService;
    CarQueryService carQueryService;
    private final RentalCommandService rentalCommandService;

//    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CarResponseDTO>> addCar(@RequestParam("images") List<MultipartFile> imageFiles,  @ModelAttribute CreateCarRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED,"Create car successful","car",carCommandService.createCar(imageFiles, request)));
    }

    @PutMapping("/{carId}")
    public ResponseEntity<ApiResponse<CarResponseDTO>> updateCar(@PathVariable Long carId, @RequestBody CarRequestDTO request) {
        return null;
    }

    @GetMapping("/{carId}")
    public ResponseEntity<ApiResponse<CarResponseDTO>> getCarById(@PathVariable Long carId) {
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Get car successfully","car",carQueryService.findCarById(carId)));
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long carId) {
        return null;
    }


    @GetMapping("/owner/${ownerId}")
    public ResponseEntity<ApiResponse<List<CarResponseDTO>>> getAllByOwnerId(@PathVariable Long ownerId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(HttpStatus.OK, "Get cars successfully", "cars", carQueryService.findCarsByOwnerId(ownerId)));
    }

    @GetMapping("/cars")
    public ResponseEntity<ApiResponse<List<CarResponseDTO>>> getAll(){
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse<>(HttpStatus.OK, "get all car successfully", "car", carQueryService.findAllCars()));
    }

}

package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.dto.rental.request.RentalRequestDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.service.command.RentalCommandService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rent")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentController {

    RentalCommandService rentalCommandService;

//    @PreAuthorize("hasRole(T(com.app.rentconnect.v1.Constants.Role).CUSTOMER.name())")
    @PostMapping()
    public ResponseEntity<ApiResponse<RentalResponseDTO>> rentCar(@RequestBody RentalRequestDTO rentalRequestDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Rent car successfully","rental",rentalCommandService.rentCar(rentalRequestDTO)));
    }

}

package com.app.rentconnect.v1.controller;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.rental.request.RentalRequestDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.mapper.RentalMapper;
import com.app.rentconnect.v1.service.command.RentalCommandService;
import com.app.rentconnect.v1.service.command.SocketCommandService;
import com.app.rentconnect.v1.service.query.RentalQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rent")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentController {

    RentalCommandService rentalCommandService;
    RentalQueryService rentalQueryService;
    SocketCommandService socketCommandService;
    RentalMapper rentalMapper;

    //    @PreAuthorize("hasRole(T(com.app.rentconnect.v1.Constants.Role).CUSTOMER.name())")
    @PostMapping()
    public ResponseEntity<ApiResponse<RentalResponseDTO>> rentCar(@RequestBody RentalRequestDTO rentalRequestDTO) {
        RentalResponseDTO rentalResponseDTO = rentalCommandService.rentCar(rentalRequestDTO);
        socketCommandService.sendMessageRentalInfo(rentalResponseDTO.getRentalId());
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Rent car successfully","rental",rentalResponseDTO));
    }

    @GetMapping("/{rentalId}")
    public ResponseEntity<ApiResponse<RentalResponseDTO>> getRentById(@PathVariable Long rentalId) {
        RentalResponseDTO rentalResponseDTO = rentalMapper.toResponseDTO(rentalQueryService.findRentalById(rentalId));
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"get rent successfully","rental",rentalResponseDTO));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<List<RentalResponseDTO>>> getRentalsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Rent car successfully","rental",rentalQueryService.findAllByOwnerId(ownerId)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<RentalResponseDTO>>> getRentalsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Rent car successfully","rental",rentalQueryService.findAllByCustomerId(customerId)));
    }

    @PostMapping("/{rentalId}/approve")
    public ResponseEntity<ApiResponse<RentalResponseDTO>> approveRental(@PathVariable Long rentalId) {
        RentalResponseDTO rentalResponseDTO = rentalCommandService.updateStatusRental(rentalId, Constants.RentalStatus.APPROVED);
        socketCommandService.sendMessageRentalInfo(rentalResponseDTO.getRentalId());
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Approved","rental",rentalResponseDTO));
    }

    @PostMapping("/{rentalId}/cancel")
    public ResponseEntity<ApiResponse<RentalResponseDTO>> cancelRental(@PathVariable Long rentalId) {
        RentalResponseDTO rentalResponseDTO = rentalCommandService.updateStatusRental(rentalId, Constants.RentalStatus.CANCELED);
        socketCommandService.sendMessageRentalInfo(rentalResponseDTO.getRentalId());
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Canceled","rental",rentalResponseDTO));
    }

    @PostMapping("/{rentalId}/reject")
    public ResponseEntity<ApiResponse<RentalResponseDTO>> rejectRetanl(@PathVariable Long rentalId) {
        RentalResponseDTO rentalResponseDTO = rentalCommandService.updateStatusRental(rentalId, Constants.RentalStatus.REJECTED);
        socketCommandService.sendMessageRentalInfo(rentalResponseDTO.getRentalId());
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK,"Rejected success","rental",rentalResponseDTO));
    }

}

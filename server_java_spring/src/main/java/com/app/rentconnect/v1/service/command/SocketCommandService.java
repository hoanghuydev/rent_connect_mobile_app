package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.entity.Car;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.mapper.RentalMapper;
import com.app.rentconnect.v1.repository.CarRepository;
import com.app.rentconnect.v1.service.query.CarQueryService;
import com.app.rentconnect.v1.service.query.RentalQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketCommandService {
    SimpMessagingTemplate messagingTemplate;
    RentalQueryService rentalQueryService;
    RentalMapper rentalMapper;
    CarQueryService carQueryService;
    private final CarRepository carRepository;

    public void sendMessageRentalInfo(Long rentalId) {
        Rental rental = rentalQueryService.findRentalById(rentalId);
        Optional<Car> car = carRepository.findById(rental.getCar().getCarId());
        if (car.isPresent()) {
            rental.setCar(car.get());
            RentalResponseDTO rentalResponseDTO = rentalMapper.toResponseDTO(rental);
            Long ownerId = car.get().getOwner().getUserId();
            Long customerId = rental.getCustomer().getUserId();
            messagingTemplate.convertAndSendToUser(String.valueOf(customerId), "/queue/rentals",rentalResponseDTO);
            messagingTemplate.convertAndSendToUser(String.valueOf(ownerId), "/queue/rentals",rentalResponseDTO);
        }

    }

}

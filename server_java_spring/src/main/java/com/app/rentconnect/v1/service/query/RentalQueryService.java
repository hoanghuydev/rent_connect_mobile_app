package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.mapper.RentalMapper;
import com.app.rentconnect.v1.mapper.RentalMapperImpl;
import com.app.rentconnect.v1.repository.RentalRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalQueryService {
    RentalRepository rentalRepository;
    RentalMapper rentalMapper;

    public Rental findRentalById(Long id) {
        return rentalRepository.findById(id).orElseThrow(()-> new RuntimeException("Rental not found"));
    }
    public List<RentalResponseDTO> findAllByOwnerId(Long ownerId) {
        var rentals = rentalRepository.findAllByCar_Owner_UserId(ownerId);
        return rentals.stream()
                .map(rentalMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<RentalResponseDTO> findAllByCustomerId(Long customerId) {
        var rentals = rentalRepository.findAllByCar_Owner_UserId(customerId);
        return rentals.stream()
                .map(rentalMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

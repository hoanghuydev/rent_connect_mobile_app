package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.rental.request.RentalRequestDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.RentalMapper;
import com.app.rentconnect.v1.repository.RentalRepository;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.util.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalCommandService {
    RentalRepository rentalRepository;
    RentalMapper rentalMapper;
    UserRepository userRepository;

    public RentalResponseDTO rentCar(RentalRequestDTO rentalRequestDTO) {
        if (rentalRepository.existsByRentalPeriod(
                rentalRequestDTO.getStartDate(),
                rentalRequestDTO.getEndDate(),
                rentalRequestDTO.getCarId()))
            throw new RuntimeException("Car is rented");
        Rental rental = rentalMapper.toEntity(rentalRequestDTO);

        User customer = SecurityUtil.getUserFromSecurityContext(userRepository);
        rental.setCustomer(customer);

        rental = rentalRepository.save(rental);
        RentalResponseDTO rentalResponseDTO = rentalMapper.toResponseDTO(rental);
        return rentalResponseDTO;
    }
}

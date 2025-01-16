package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.dto.rental.request.RentalRequestDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.entity.Rental;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.RentalMapper;
import com.app.rentconnect.v1.repository.RentalRepository;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.service.query.CarQueryService;
import com.app.rentconnect.v1.service.query.RentalQueryService;
import com.app.rentconnect.v1.util.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalCommandService {
    RentalRepository rentalRepository;
    RentalMapper rentalMapper;
    UserRepository userRepository;
   RentalQueryService rentalQueryService;
    private final CarQueryService carQueryService;

    public RentalResponseDTO rentCar(RentalRequestDTO rentalRequestDTO) {
        if (rentalRepository.existsByRentalPeriod(
                rentalRequestDTO.getStartDate(),
                rentalRequestDTO.getEndDate(),
                rentalRequestDTO.getCarId()))
            throw new RuntimeException("Car is rented");

        Rental rental = rentalMapper.toEntity(rentalRequestDTO);

        CarResponseDTO car = carQueryService.findCarById(rentalRequestDTO.getCarId());
        long rentalPeriodInDays = ChronoUnit.DAYS.between(rentalRequestDTO.getStartDate(), rentalRequestDTO.getEndDate());
        BigDecimal totalPrice = BigDecimal.valueOf(rentalPeriodInDays).multiply(car.getPricePerDay());
        rental.setTotalPrice(totalPrice);


        User customer = SecurityUtil.getUserFromSecurityContext(userRepository);
        rental.setCustomer(customer);

        rental.setStatus(Constants.RentalStatus.REQUESTED);

        rental = rentalRepository.save(rental);
        RentalResponseDTO rentalResponseDTO = rentalMapper.toResponseDTO(rental);
        return rentalResponseDTO;
    }
    public Rental updateRentPaid(Long rentalId,boolean paid) {
        Rental rental = rentalQueryService.findRentalById(rentalId);
        rental.setPaid(paid);
        rental = rentalRepository.save(rental);
        return rental;
    }
    public RentalResponseDTO updateStatusRental(Long id,Constants.RentalStatus status) {
        Rental rental = rentalQueryService.findRentalById(id);
        rental.setStatus(status);
        rental = rentalRepository.save(rental);
        return rentalMapper.toResponseDTO(rental);
    }
}

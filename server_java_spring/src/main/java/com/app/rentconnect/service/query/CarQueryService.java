package com.app.rentconnect.service.query;

import com.app.rentconnect.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.dto.car.response.CarResponseDTO;
import com.app.rentconnect.entity.Car;
import com.app.rentconnect.mapper.CarMapper;
import com.app.rentconnect.repository.CarRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.BadRequestException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarQueryService {
    CarRepository carRepository;
    CarMapper carMapper;

    public CarResponseDTO findCarById(Long id) {
        Car car = carRepository.findById(id).orElseThrow(()-> new UsernameNotFoundException("Not found car"));
        return carMapper.toCarResponseDTO(Optional.ofNullable(car));

    }
}

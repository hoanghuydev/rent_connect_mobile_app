package com.app.rentconnect.service.command;

import com.app.rentconnect.dto.car.request.CarRequestDTO;
import com.app.rentconnect.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.dto.car.response.CarResponseDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.entity.Car;
import com.app.rentconnect.mapper.CarMapper;
import com.app.rentconnect.repository.CarRepository;
import com.app.rentconnect.service.query.CarQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CarCommandService {
    CarMapper carMapper;
    CarRepository carRepository;
    CarQueryService carQueryService;
    public ApiResponse<CarResponseDTO> createCar(CreateCarRequestDTO createCarRequestDTO) {
        Car car = carMapper.toEntity(createCarRequestDTO);
        car = carRepository.save(car);
        CarResponseDTO carResponseDTO = carMapper.toCarResponseDTO(Optional.of(car));
        return new ApiResponse<>(HttpStatus.OK, "Created car", "car", carResponseDTO);
    }
}

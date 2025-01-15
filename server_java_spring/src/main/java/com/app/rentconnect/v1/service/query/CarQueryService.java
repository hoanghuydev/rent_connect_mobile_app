package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.entity.Car;
import com.app.rentconnect.v1.mapper.CarMapper;
import com.app.rentconnect.v1.repository.CarRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class CarQueryService {
    CarRepository carRepository;
    CarMapper carMapper;

    public CarResponseDTO findCarById(Long id) {
        Car car = carRepository.findById(id).orElseThrow(()-> new UsernameNotFoundException("Not found car"));
        CarResponseDTO carResponseDTO = carMapper.toCarResponseDTO(car);
        return carResponseDTO;
    }

    public List<CarResponseDTO> findAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(carMapper::toCarResponseDTO)
                .collect(Collectors.toList());
    }
}

package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.entity.Car;
import com.app.rentconnect.v1.entity.CarImage;
import com.app.rentconnect.v1.mapper.CarMapper;
import com.app.rentconnect.v1.repository.CarImageRepository;
import com.app.rentconnect.v1.repository.CarRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
    private final CarImageRepository carImageRepository;

    public CarResponseDTO findCarById(Long id) {
        Car car = carRepository.findById(id).orElseThrow(()-> new UsernameNotFoundException("Not found car"));
        List<CarImage> carImages = carImageRepository.findByCar_CarId(car.getCarId());
        CarResponseDTO carResponseDTO = carMapper.toCarResponseDTO(car);
        List<String> imageUrls = carImages.stream()
                .map(CarImage::getImageUrl)
                        .collect(Collectors.toList());
        carResponseDTO.setImages(imageUrls);
        return carResponseDTO;
    }

    public List<CarResponseDTO> findCarsByOwnerId(Long ownerId) {
        List<Car> cars = carRepository.findAllByOwner_UserId(ownerId);
        return cars.stream()
                .map(carMapper::toCarResponseDTO)
                .collect(Collectors.toList());
    }
    public List<CarResponseDTO> findAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(carMapper::toCarResponseDTO)
                .collect(Collectors.toList());
    }
}

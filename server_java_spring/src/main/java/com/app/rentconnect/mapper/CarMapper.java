package com.app.rentconnect.mapper;

import com.app.rentconnect.dto.car.request.CarRequestDTO;
import com.app.rentconnect.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.dto.car.response.CarResponseDTO;
import com.app.rentconnect.entity.Car;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface CarMapper {
    Car toEntity(CarRequestDTO carRequestDTO);
    Car toEntity(CreateCarRequestDTO createCarRequestDTO);
    CarRequestDTO toCarRequestDTO(Car car);
    CarResponseDTO toCarResponseDTO(Optional<Car> car);
}

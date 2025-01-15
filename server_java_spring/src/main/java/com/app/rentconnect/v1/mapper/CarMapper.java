package com.app.rentconnect.v1.mapper;

import com.app.rentconnect.v1.dto.car.request.CarLocationRequestDTO;
import com.app.rentconnect.v1.dto.car.request.CarRequestDTO;
import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.dto.car.response.CarResponseDTO;
import com.app.rentconnect.v1.entity.Car;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {CarLocationMapper.class})
public interface CarMapper {

    @Mapping(target = "images", ignore = true)
    Car toEntity(CarRequestDTO carRequestDTO);

    @Mapping(target = "images", ignore = true)
    CarRequestDTO toCarRequestDTO(Car car);

    @Mapping(target = "images", ignore = true)
    CarResponseDTO toCarResponseDTO(Car car);

    @Mapping(target = "images", ignore = true)
    @Mapping(target = "reviews",ignore = true)
    @Mapping(target = "rentals",ignore = true)
    @Mapping(target = "owner",ignore = true)
    @Mapping(target = "timesRented", constant = "0")
    @Mapping(source = "transmissionId",target = "transmission.transmissionId")
    @Mapping(source = "fuelId",target = "fuel.fuelId")
    Car toEntity(CreateCarRequestDTO createCarRequestDTO);

}

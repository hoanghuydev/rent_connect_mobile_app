package com.app.rentconnect.v1.mapper;

import com.app.rentconnect.v1.dto.car.request.CarLocationRequestDTO;
import com.app.rentconnect.v1.dto.car.request.CreateCarRequestDTO;
import com.app.rentconnect.v1.entity.CarLocation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.sql.Date;
import java.sql.Timestamp;

@Mapper(componentModel = "spring")
public interface CarLocationMapper {
    @Mapping(target = "locationId", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    CarLocation toEntity(CarLocationRequestDTO carLocationRequestDTO);

    CarLocationRequestDTO toCarLocationRequest(CreateCarRequestDTO createCarRequestDTO);

}


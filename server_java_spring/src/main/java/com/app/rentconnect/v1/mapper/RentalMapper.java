package com.app.rentconnect.v1.mapper;

import com.app.rentconnect.v1.dto.rental.request.RentalRequestDTO;
import com.app.rentconnect.v1.dto.rental.response.RentalResponseDTO;
import com.app.rentconnect.v1.entity.Rental;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RentalMapper {
    @Mapping(source = "carId",target = "car.carId")
    @Mapping(source = "customerId",target = "customer.userId")
    Rental toEntity(RentalRequestDTO rentalRequestDTO);

    RentalResponseDTO toResponseDTO(Rental rental);
}

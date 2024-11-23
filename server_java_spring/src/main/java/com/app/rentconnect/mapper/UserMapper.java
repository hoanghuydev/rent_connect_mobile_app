package com.app.rentconnect.mapper;

import com.app.rentconnect.dto.request.RegisterRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "fullName", target = "fullName")
    UserRequestDTO toRequestDTO(User user);
    @Mapping(source = "fullName", target = "fullName")
    User toEntity(UserRequestDTO userDTO);
    @Mapping(source = "fullName", target = "fullName")
    User registerDTOtoEntity(RegisterRequestDTO registerRequestDTO);
}

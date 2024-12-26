package com.app.rentconnect.v1.mapper;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", ignore = true)
    User registerDTOtoEntity(RegisterRequestDTO registerRequestDTO);
    UserRequestDTO toRequestDTO(User user);

    @Mapping(target = "loginPlatform", ignore = true)
    User toEntity(UserRequestDTO userDTO);
}

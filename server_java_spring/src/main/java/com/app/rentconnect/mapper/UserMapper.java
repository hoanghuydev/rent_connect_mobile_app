package com.app.rentconnect.mapper;

import com.app.rentconnect.dto.request.RegisterRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", ignore = true)
    User registerDTOtoEntity(RegisterRequestDTO registerRequestDTO);
    UserRequestDTO toRequestDTO(User user);
    User toEntity(UserRequestDTO userDTO);

}

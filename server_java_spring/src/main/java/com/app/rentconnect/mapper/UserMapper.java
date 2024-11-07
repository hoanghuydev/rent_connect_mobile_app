package com.app.rentconnect.mapper;

import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserRequestDTO toRequestDTO(User user);
    User toEntity(UserRequestDTO userDTO);
}

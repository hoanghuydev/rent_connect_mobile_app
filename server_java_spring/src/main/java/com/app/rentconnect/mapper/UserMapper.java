package com.app.rentconnect.mapper;

import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.auth.request.RegisterRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", ignore = true)
    User registerDTOtoEntity(RegisterRequestDTO registerRequestDTO);
    UserRequestDTO toRequestDTO(User user);
    User toEntity(UserRequestDTO userDTO);
    @AfterMapping
    default void setDefaultValues(@MappingTarget User user) {
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(java.time.LocalDateTime.now());
        }
        if (user.getVerified() == null) {
            user.setVerified(false);
        }
        if (user.getUserType() == null) {
            user.setUserType(Constants.UserType.customer);
        }
        if (user.getLoginPlatform() == null) {
            user.setLoginPlatform(Constants.LoginPlatform.email);
        }
    }
}

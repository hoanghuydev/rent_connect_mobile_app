package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.service.query.UserQueryService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class UserCommandService {
    UserRepository userRepository;
    UserMapper userMapper;
    UserQueryService userQueryService;

    public User save(User user) {
        return userRepository.save(user);
    }

    public void verifyByEmail(String email,boolean isVerified) {
        userRepository.vertifyUserByEmail(email,isVerified);
    }

    public UserRequestDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id).orElse(null);
        User updatedUser = userMapper.toEntity(userRequestDTO);
        if (user != null) {
            int isUpdated = userRepository.updateUser(id, updatedUser.getFullName(), updatedUser.getEmail(), updatedUser.getPhoneNumber());
            if (isUpdated > 0) {
                return userQueryService.findById(id);
            }
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

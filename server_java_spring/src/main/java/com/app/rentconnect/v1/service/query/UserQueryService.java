package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.user.response.UserResponseDTO;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class UserQueryService {
    UserRepository userRepository;
    UserMapper userMapper;

    public User findByEmailAndVerify(String email, boolean verify) {
        return userRepository.findByEmailAndVerified(email,verify)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Not found user"));
    }

    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Not found user"));
        UserResponseDTO userResponseDTO = userMapper.toResponseDTO(user);
        return userResponseDTO;
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<UserResponseDTO> findAll() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(user -> userMapper.toResponseDTO(user))
                .collect(Collectors.toList());
    }
}

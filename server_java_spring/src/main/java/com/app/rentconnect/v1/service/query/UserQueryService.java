package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.dto.user.response.UserResponseDTO;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.jpa.repository.EntityGraph;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @EntityGraph(attributePaths = {"roles"})
    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Not found user"));
        UserResponseDTO userResponseDTO = userMapper.toResponseDTO(user);
        return userResponseDTO;
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<UserRequestDTO> getAll() {
        //tim tat ca cac user va chuyen doi thanh UserRequestDTO
        return userRepository.findAll().stream()
                .map(userMapper::toRequestDTO)
                .collect(Collectors.toList());
    }

    public UserRequestDTO findById(Long id) {
        return userMapper.toRequestDTO(userRepository.findById(id).orElse(null));
    }

}

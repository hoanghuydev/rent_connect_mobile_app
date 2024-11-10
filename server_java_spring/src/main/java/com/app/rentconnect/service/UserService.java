package com.app.rentconnect.service;

import com.app.rentconnect.dto.request.LoginRequestDTO;
import com.app.rentconnect.dto.request.RegisterRequestDTO;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

}

package com.app.rentconnect.service.query;

import com.app.rentconnect.entity.User;
import com.app.rentconnect.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class UserQueryService {
    UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}

package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.repository.UserRepository;
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

    public User findByEmailAndVerify(String email, boolean verify) {
        return userRepository.findByEmailAndVerified(email,verify)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}

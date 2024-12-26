package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.repository.UserRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class UserCommandService {
    UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }
    public void verifyByEmail(String email,boolean isVerified) {
        userRepository.vertifyUserByEmail(email,isVerified);
    }
}

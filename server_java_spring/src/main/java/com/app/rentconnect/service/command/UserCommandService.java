package com.app.rentconnect.service.command;

import com.app.rentconnect.entity.User;
import com.app.rentconnect.repository.UserRepository;
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
}

package com.app.rentconnect.service;

import com.app.rentconnect.Constants;
import com.app.rentconnect.dto.request.LoginRequestDTO;
import com.app.rentconnect.dto.request.RegisterRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.entity.User;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
    public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public User save(User user) {
        user.setLoginPlatform(Constants.LoginPlatform.OTHER);
        user.setUserType(Constants.UserType.CUSTOMER);
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserRequestDTO login (LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail());

        if (user != null) {
            if (passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword()) ) {
                return userMapper.toRequestDTO(user);
            }
        }
        return null;
    }

    // Cập nhật tên người dùng
    public boolean updateFullName(String fullName, String email) {
        return userRepository.updateFullNameByEmail(fullName, email);
    }

    // Cập nhật email người dùng
    public boolean updateEmail(String email, String oldEmail) {
        return userRepository.updateEmailByEmail(email, oldEmail);
    }

    // Cập nhật số điện thoại người dùng
    public boolean updatePhoneNumber(String phoneNumber, String email) {
        return userRepository.updatePhoneNumberByEmail(phoneNumber, email);
    }


}

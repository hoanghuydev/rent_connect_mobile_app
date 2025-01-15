package com.app.rentconnect.v1.service.command;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.dto.auth.request.OAuthRequestDTO;
import com.app.rentconnect.v1.dto.auth.response.LoginResponse;
import com.app.rentconnect.v1.entity.Role;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.mapper.UserMapperImpl;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.service.query.RoleQueryService;
import com.app.rentconnect.v1.util.JwtUtil;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OAuthCommandService {
    UserRepository userRepository;
    UserMapper userMapper;
    JwtUtil jwtUtil;
    AuthenticationManager authenticationManager;
    private final RoleQueryService roleQueryService;

    public LoginResponse registerAndLogin(OAuthRequestDTO oAuthRequestDTO) {
        Optional<User> userInfo = userRepository.findByEmail(oAuthRequestDTO.getEmail());
        if (userInfo.isPresent() && userInfo.get().getLoginPlatform()==Constants.LoginPlatform.EMAIL) {
            return this.login(userInfo.get());
        } else if (userInfo.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        } else {
            return this.register(oAuthRequestDTO);
        }

    }
    public LoginResponse login(User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            user = userRepository.save(user);
            String jwt = jwtUtil.generateToken(userDetails);
            LoginResponse loginResponse = new LoginResponse(userMapper.toRequestDTO(user),jwt);
            return loginResponse;
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        } catch (JOSEException e) {
            throw new RuntimeException();
        }
    }
    public LoginResponse register(OAuthRequestDTO oAuthRequestDTO) {
        Set<Role> roles = new HashSet<>();
        Role customerRole = roleQueryService.findByRoleName(Constants.Role.CUSTOMER.name());
        roles.add(customerRole);
        User user = User.builder()
                .email(oAuthRequestDTO.getEmail())
                .fullName(oAuthRequestDTO.getFullName())
                .verified(true)
                .loginPlatform(Constants.LoginPlatform.EMAIL)
                .roles(roles)
                .build();
        user = userRepository.save(user);
        return this.login(user);
    }
}

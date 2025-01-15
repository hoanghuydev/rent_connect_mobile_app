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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OAuthCommandService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private RoleQueryService roleQueryService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${oauth2.password}")
    private String oauth2Password;



    public Map<String, Object> getUserInfoFromGoogle(String token) {
        String url = "https://www.googleapis.com/oauth2/v3/userinfo";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(url, HttpMethod.GET, entity, Map.class).getBody();
    }

    public LoginResponse registerAndLogin(OAuthRequestDTO oAuthRequestDTO) {
        Optional<User> userInfo = userRepository.findByEmail(oAuthRequestDTO.getEmail());
        if (userInfo.isPresent() && userInfo.get().getLoginPlatform()==Constants.LoginPlatform.GOOGLE) {
            User user = userInfo.get();
            return this.loginOauth2(user);
        } else if (userInfo.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        } else {
            return this.register(oAuthRequestDTO);
        }

    }
    public LoginResponse loginOauth2(User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            oauth2Password
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
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
                .loginPlatform(Constants.LoginPlatform.GOOGLE)
                .roles(roles)
                .password(passwordEncoder.encode(oauth2Password))
                .build();
        user = userRepository.save(user);
        return this.loginOauth2(user);
    }
}

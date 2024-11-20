package com.app.rentconnect.service.query;

import com.app.rentconnect.dto.request.LoginRequestDTO;
import com.app.rentconnect.dto.request.UserRequestDTO;
import com.app.rentconnect.dto.response.ApiResponse;
import com.app.rentconnect.dto.response.LoginResponse;
import com.app.rentconnect.mapper.UserMapper;
import com.app.rentconnect.util.JwtUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthQueryService {
    AuthenticationManager authenticationManager;
    JwtUtil jwtUtil;
    UserMapper userMapper;
    UserQueryService userQueryService;

    public ApiResponse<LoginResponse> login(LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getEmail(),
                            loginRequestDTO.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserRequestDTO user = userMapper.toRequestDTO(userQueryService.findByEmail(userDetails.getUsername()));
            String jwt = jwtUtil.generateToken(userDetails);
            LoginResponse loginResponse = new LoginResponse(user,jwt);
            return new ApiResponse<LoginResponse>(HttpStatus.ACCEPTED,"Logged in","user",loginResponse);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }
}

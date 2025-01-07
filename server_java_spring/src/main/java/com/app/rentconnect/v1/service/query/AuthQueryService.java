package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.dto.auth.request.LoginRequestDTO;
import com.app.rentconnect.v1.dto.request.UserRequestDTO;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.dto.auth.response.LoginResponse;
import com.app.rentconnect.v1.mapper.UserMapper;
import com.app.rentconnect.v1.util.JwtUtil;
import com.nimbusds.jose.JOSEException;
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

}

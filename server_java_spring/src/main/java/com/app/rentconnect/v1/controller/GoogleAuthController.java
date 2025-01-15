package com.app.rentconnect.v1.controller;
import com.app.rentconnect.v1.dto.auth.request.OAuthRequestDTO;
import com.app.rentconnect.v1.dto.auth.response.LoginResponse;
import com.app.rentconnect.v1.dto.response.ApiResponse;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.service.command.OAuthCommandService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/oauth2/callback/google")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class GoogleAuthController {

    OAuthCommandService oauthCommandService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<LoginResponse>> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) throw new RuntimeException("Principal is null");
        String email = principal.getAttribute("email");
        String fullName = principal.getAttribute("name");
        OAuthRequestDTO oAuthRequestDTO = new OAuthRequestDTO(email,fullName);
        return ResponseEntity.ok().body(new ApiResponse<>(HttpStatus.OK,"Login success","data",oauthCommandService.registerAndLogin(oAuthRequestDTO)));
    }
}

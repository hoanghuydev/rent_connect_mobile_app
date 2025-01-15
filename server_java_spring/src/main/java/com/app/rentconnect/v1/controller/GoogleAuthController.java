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
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/oauth2/callback/google")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class GoogleAuthController {

    OAuthCommandService oauthCommandService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<LoginResponse>> getUser(@RequestBody Map<String,String> payload) {
        String token = payload.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(HttpStatus.BAD_REQUEST, "Token is missing", null, null)
            );
        }

        Map<String, Object> userInfo = oauthCommandService.getUserInfoFromGoogle(token);

        String email = (String) userInfo.get("email");
        String fullName = (String) userInfo.get("name");
        OAuthRequestDTO oAuthRequestDTO = new OAuthRequestDTO(email,fullName);
        return ResponseEntity.ok().body(new ApiResponse<>(HttpStatus.OK,"Login success","data",oauthCommandService.registerAndLogin(oAuthRequestDTO)));
    }
}

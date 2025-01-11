package com.app.rentconnect.v1.util;
import com.app.rentconnect.v1.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtil {
    public static Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new SecurityException("No authentication information found in SecurityContext");
        }
        return authentication;


    }

    public static com.app.rentconnect.v1.entity.User getUserFromSecurityContext(UserRepository userRepository) {
        Authentication authentication = getAuthentication();
        if (authentication == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
}

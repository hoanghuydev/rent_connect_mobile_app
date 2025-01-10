package com.app.rentconnect.v1.configuration;

import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.entity.Role;
import com.app.rentconnect.v1.entity.User;
import com.app.rentconnect.v1.repository.RoleRepository;
import com.app.rentconnect.v1.repository.UserRepository;
import com.app.rentconnect.v1.service.query.RoleQueryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class ApplicationInitConfig {
    private static final Logger log = LoggerFactory.getLogger(ApplicationInitConfig.class);
    @Value("${admin.application.email}")
    private String adminEmail;

    @Value("${admin.application.password}")
    private String adminPassword;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleQueryService roleQueryService) {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                Set<Role> roles = new HashSet<>();
                Role superAdminRole = roleQueryService.findByRoleName(Constants.Role.SUPER_ADMIN.name());
                //roles.add(superAdminRole);
                String hashedPassword = passwordEncoder.encode(adminPassword);
                User user = User.builder()
                        .email(adminEmail)
                        .password(hashedPassword)
                        .roles(roles)
                        .fullName("Super Admin")
                        .verified(true)
                        .loginPlatform(Constants.LoginPlatform.EMAIL)
                        .build();
                userRepository.save(user);
                log.info("Created super admin account");
            }

        };
    }
}

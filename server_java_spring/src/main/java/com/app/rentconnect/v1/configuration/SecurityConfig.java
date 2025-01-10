package com.app.rentconnect.v1.configuration;
import com.app.rentconnect.v1.Constants;
import com.app.rentconnect.v1.security.JwtAuthenticationFilter;
import com.app.rentconnect.v1.service.query.UserDetailsQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final String[] PUBLIC_POST_ENDPOINT = {"/api/v1/auth/register","/api/v1/auth/verify","/api/v1/otp/send","/api/v1/auth/login","/api/v1/car/add"};
    private final String[] PUBLIC_GET_ENDPOINT = {"/api/v1/auth/register","/api/v1/auth/login","/api/v1/user/{id}","/api/v1/car/{carId}", "/api/v1/user"};
    private final String[] ROLE_ADMIN_ENDPOINT = {};
    private final String[] ROLE_OWNER_ENDPOINT = {};
    private final String[] ROLE_CUSTOMER_ENDPOINT = {};
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Autowired
    private UserDetailsQueryService userDetailsQueryService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,this.ROLE_ADMIN_ENDPOINT).hasRole(Constants.Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST,this.ROLE_OWNER_ENDPOINT).hasRole(Constants.Role.OWNER.name())
                        .requestMatchers(HttpMethod.POST,this.ROLE_CUSTOMER_ENDPOINT).hasRole(Constants.Role.CUSTOMER.name())
                        .requestMatchers(HttpMethod.POST,this.PUBLIC_POST_ENDPOINT).permitAll()
                        .requestMatchers(HttpMethod.GET,this.PUBLIC_GET_ENDPOINT).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());
//        http.cors();

        return http.build();
    }
    @Bean
    public JwtDecoder jwtDecoder(){
        SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(), "HS256");
        return NimbusJwtDecoder.withSecretKey(secretKey).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsQueryService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

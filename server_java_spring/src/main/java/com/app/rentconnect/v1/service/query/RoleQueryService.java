package com.app.rentconnect.v1.service.query;

import com.app.rentconnect.v1.entity.Role;
import com.app.rentconnect.v1.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleQueryService {
    RoleRepository roleRepository;
    public Role findByRoleName(String roleName) {
        return roleRepository.findByRoleName(roleName).orElseThrow(()-> new RuntimeException("Not found role"));
    }
}

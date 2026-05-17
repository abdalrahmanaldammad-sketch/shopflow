package org.example.shopflow.shared;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.user.entity.Role;
import org.example.shopflow.user.entity.enums.RoleName;
import org.example.shopflow.user.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                try {
                    roleRepository.save(Role.builder().name(roleName).build());
                    log.info("Created role: {}", roleName);
                } catch (Exception e) {
                    // Another instance may have inserted it concurrently — safe to ignore
                    log.debug("Role {} already exists (concurrent insert)", roleName);
                }
            }
        }
    }
}

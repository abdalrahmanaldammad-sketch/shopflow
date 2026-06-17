package org.example.shopflow.shared;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.product.entity.Product;
import org.example.shopflow.product.repository.ProductRepository;
import org.example.shopflow.user.entity.Role;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.entity.enums.RoleName;
import org.example.shopflow.user.repository.RoleRepository;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

// Seeds deterministic data for the stress test (Req 9) and benchmark (Req 10).
// Only active under the 'loadtest' profile, so it never touches a real environment.
// Runs after DataInitializer (which seeds roles) via @Order.
@Component
@Profile("loadtest")
@Order(Ordered.LOWEST_PRECEDENCE)
@RequiredArgsConstructor
@Slf4j
public class LoadTestDataInitializer implements CommandLineRunner {

    // Must match OrderService.DEMO_USER_EMAIL — orders without a principal run as this user.
    public static final String DEMO_USER_EMAIL = "loadtest@shopflow.dev";

    // Catalog size is configurable so ONE image serves both demo scenarios (see loadtest/bench.sh):
    //   - integrity (Req 9): a SMALL catalog → high write contention → shows the lock holding.
    //   - cache (Req 6/10):  a LARGE catalog → expensive reads → shows the caching benefit.
    // Set via LOADTEST_SEED_PRODUCTS (env) / loadtest.seed.products (property). Default 5,000.
    @org.springframework.beans.factory.annotation.Value("${loadtest.seed.products:5000}")
    private int seedProductCount;

    private static final int SEED_STOCK_PER_PRODUCT = 100_000;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDemoUser();
        seedProducts();
    }

    private void seedDemoUser() {
        if (userRepository.existsByEmail(DEMO_USER_EMAIL)) {
            log.info("[loadtest] Demo user already present — skipping");
            return;
        }
        Set<Role> roles = new HashSet<>();
        roleRepository.findByName(RoleName.ROLE_USER).ifPresent(roles::add);

        User demo = User.builder()
                .email(DEMO_USER_EMAIL)
                .password(passwordEncoder.encode("loadtest"))
                .firstName("Load")
                .lastName("Test")
                .emailVerified(true)
                .enabled(true)
                .roles(roles)
                .build();
        userRepository.save(demo);
        log.info("[loadtest] Seeded demo user {}", DEMO_USER_EMAIL);
    }

    private void seedProducts() {
        long existing = productRepository.count();
        if (existing > 0) {
            log.info("[loadtest] {} products already present — skipping product seed", existing);
            return;
        }
        java.util.List<Product> batch = new java.util.ArrayList<>(seedProductCount);
        for (int i = 1; i <= seedProductCount; i++) {
            batch.add(Product.builder()
                    .name("Load Test Product " + i)
                    .description("Seeded product for stress testing and benchmarking")
                    .price(BigDecimal.valueOf(9.99 + i))
                    .stockQuantity(SEED_STOCK_PER_PRODUCT)
                    .build());
        }
        productRepository.saveAll(batch);
        log.info("[loadtest] Seeded {} products with {} stock each",
                seedProductCount, SEED_STOCK_PER_PRODUCT);
    }
}
package org.example.shopflow.product.strategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.product.entity.Product;
import org.example.shopflow.product.repository.ProductRepository;
import org.example.shopflow.shared.config.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

// Req 1 — Optimistic Locking Strategy.
// Best for normal purchases where conflicts are rare.
// No DB locks are held — instead JPA's @Version column detects conflicts at save time.
// If two threads race, the loser gets OptimisticLockException and retries up to MAX_RETRIES.
@Component("optimisticPurchase")
@RequiredArgsConstructor
@Slf4j
public class OptimisticPurchaseStrategy implements PurchaseStrategy {

    private static final int MAX_RETRIES = 3;

    private final ProductRepository productRepository;

    // Req 6 — stock changed, so the cached catalog is now stale → evict it.
    // allEntries because both the 'all' list and the per-id entry hold this product's stock.
    @Override
    @Transactional
    @CacheEvict(value = CacheConfig.PRODUCTS_CACHE, allEntries = true)
    public Product purchase(UUID productId, int quantity) {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                return attemptPurchase(productId, quantity);
            } catch (ObjectOptimisticLockingFailureException ex) {
                attempt++;
                log.warn("Optimistic lock conflict on product {} — attempt {}/{}", productId, attempt, MAX_RETRIES);
                if (attempt >= MAX_RETRIES) {
                    throw new RuntimeException("Product is being updated by another request. Please try again.");
                }
            }
        }
        throw new RuntimeException("Purchase failed after retries.");
    }

    private Product attemptPurchase(UUID productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }


        product.setStockQuantity(product.getStockQuantity() - quantity);
        return productRepository.save(product);
        // JPA executes: UPDATE products SET stock_quantity=?, version=version+1 WHERE id=? AND version=?
        // If version changed between read and save → exception is thrown → retry
    }
}
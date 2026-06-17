package org.example.shopflow.product.service;

import lombok.RequiredArgsConstructor;
import org.example.shopflow.product.dto.response.ProductResponse;
import org.example.shopflow.product.entity.Product;
import org.example.shopflow.product.repository.ProductRepository;
import org.example.shopflow.shared.config.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Req 6 — served from Redis on repeat calls; only the first call (or after eviction/TTL)
    // hits Postgres. DTOs are cached, never JPA entities, to avoid serializing Hibernate proxies.
    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "'all'")
    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        // NOTE: must be a mutable ArrayList, not Stream.toList() (immutable). The Redis JSON
        // serializer writes the concrete list type and cannot reconstruct ImmutableCollections
        // on cache read-back — that would throw on every cache hit.
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
    }

    @Cacheable(value = CacheConfig.PRODUCTS_CACHE, key = "#id")
    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return ProductResponse.from(product);
    }

    // Req 6 — evict on write so the catalog never serves stale data.
    // allEntries=true because the 'all' list and the per-id entry overlap; a single new/changed
    // product invalidates both.
    @CacheEvict(value = CacheConfig.PRODUCTS_CACHE, allEntries = true)
    @Transactional
    public Product create(Product product) {
        return productRepository.save(product);
    }
}
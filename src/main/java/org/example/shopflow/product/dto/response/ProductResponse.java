package org.example.shopflow.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.shopflow.product.entity.Product;

import java.math.BigDecimal;
import java.io.Serializable;
import java.util.UUID;

// Cached in Redis (Req 6). @NoArgsConstructor + @AllArgsConstructor are required so
// Jackson can deserialize it back out of the cache.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse implements Serializable {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .build();
    }
}
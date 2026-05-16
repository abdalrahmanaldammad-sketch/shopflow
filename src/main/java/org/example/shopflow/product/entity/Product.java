package org.example.shopflow.product.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.shopflow.shared.common.Auditable;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    // Req 1 — Optimistic Locking: JPA auto-increments this on every UPDATE.
    // If two threads read version=5 and both try to save, the second throws
    // OptimisticLockException because the WHERE version=5 no longer matches.
    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;
}
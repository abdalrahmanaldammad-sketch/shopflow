package org.example.shopflow.product.strategy;

import org.example.shopflow.product.entity.Product;

import java.util.UUID;

// Strategy Pattern: defines the contract for purchasing a product.
// OrderService depends only on this interface — it never knows which
// locking mechanism is being used underneath.
public interface PurchaseStrategy {
    Product purchase(UUID productId, int quantity);
}
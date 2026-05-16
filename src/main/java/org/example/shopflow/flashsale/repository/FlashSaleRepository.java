package org.example.shopflow.flashsale.repository;

import jakarta.persistence.LockModeType;
import org.example.shopflow.flashsale.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface FlashSaleRepository extends JpaRepository<FlashSale, UUID> {

    // Req 1 — Pessimistic Locking: acquires an exclusive DB row lock on read.
    // All other threads trying to read this row will BLOCK until the lock is released,
    // ensuring only one thread decrements remainingQuantity at a time.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT f FROM FlashSale f WHERE f.id = :id")
    Optional<FlashSale> findByIdWithLock(@Param("id") UUID id);

    @Query("SELECT f FROM FlashSale f WHERE f.active = true AND f.product.id = :productId")
    Optional<FlashSale> findActiveByProductId(@Param("productId") UUID productId);
}
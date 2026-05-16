package org.example.shopflow.product.strategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.flashsale.entity.FlashSale;
import org.example.shopflow.flashsale.repository.FlashSaleRepository;
import org.example.shopflow.product.entity.Product;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

// Req 1 — Pessimistic Locking Strategy.
// Best for flash sales where thousands compete for the same item simultaneously.
// The DB row is exclusively locked on read — all other threads WAIT at the DB level
// until the lock is released, so no two threads can decrement at the same time.
@Component("pessimisticPurchase")
@RequiredArgsConstructor
@Slf4j
public class PessimisticPurchaseStrategy implements PurchaseStrategy {

    private final FlashSaleRepository flashSaleRepository;

    @Override
    @Transactional
    public Product purchase(UUID flashSaleId, int quantity) {
        // findByIdWithLock issues: SELECT ... FOR UPDATE — row is locked until commit
        FlashSale flashSale = flashSaleRepository.findByIdWithLock(flashSaleId)
                .orElseThrow(() -> new RuntimeException("Flash sale not found or already ended"));

        if (!flashSale.isActive()) {
            throw new RuntimeException("Flash sale is no longer active");
        }

        if (flashSale.getRemainingQuantity() < quantity) {
            throw new RuntimeException("Flash sale stock exhausted. Remaining: " + flashSale.getRemainingQuantity());
        }

        flashSale.setRemainingQuantity(flashSale.getRemainingQuantity() - quantity);

        if (flashSale.getRemainingQuantity() == 0) {
            flashSale.setActive(false);
        }

        flashSaleRepository.save(flashSale);
        log.info("Flash sale purchase — remaining: {}", flashSale.getRemainingQuantity());

        return flashSale.getProduct();
    }
}
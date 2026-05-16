package org.example.shopflow.flashsale.service;

import lombok.RequiredArgsConstructor;
import org.example.shopflow.flashsale.entity.FlashSale;
import org.example.shopflow.flashsale.repository.FlashSaleRepository;
import org.example.shopflow.product.entity.Product;
import org.example.shopflow.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final ProductRepository productRepository;

    @Transactional
    public FlashSale createFlashSale(UUID productId, BigDecimal discountedPrice,
                                     int quantity, Instant startTime, Instant endTime) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        FlashSale flashSale = FlashSale.builder()
                .product(product)
                .discountedPrice(discountedPrice)
                .totalQuantity(quantity)
                .remainingQuantity(quantity)
                .startTime(startTime)
                .endTime(endTime)
                .active(true)
                .build();

        return flashSaleRepository.save(flashSale);
    }

    @Transactional(readOnly = true)
    public FlashSale findById(UUID id) {
        return flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flash sale not found"));
    }
}
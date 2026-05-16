package org.example.shopflow.flashsale.dto.response;

import lombok.Builder;
import lombok.Data;
import org.example.shopflow.flashsale.entity.FlashSale;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class FlashSaleResponse {
    private UUID id;
    private UUID productId;
    private String productName;
    private BigDecimal discountedPrice;
    private int totalQuantity;
    private int remainingQuantity;
    private Instant startTime;
    private Instant endTime;
    private boolean active;

    public static FlashSaleResponse from(FlashSale fs) {
        return FlashSaleResponse.builder()
                .id(fs.getId())
                .productId(fs.getProduct().getId())
                .productName(fs.getProduct().getName())
                .discountedPrice(fs.getDiscountedPrice())
                .totalQuantity(fs.getTotalQuantity())
                .remainingQuantity(fs.getRemainingQuantity())
                .startTime(fs.getStartTime())
                .endTime(fs.getEndTime())
                .active(fs.isActive())
                .build();
    }
}
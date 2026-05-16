package org.example.shopflow.flashsale.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
public class CreateFlashSaleRequest {

    @NotNull
    private UUID productId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal discountedPrice;

    @Min(1)
    private int quantity;

    @NotNull
    private Instant startTime;

    @NotNull
    private Instant endTime;
}
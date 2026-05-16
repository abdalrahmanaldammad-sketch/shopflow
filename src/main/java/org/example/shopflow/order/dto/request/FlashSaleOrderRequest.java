package org.example.shopflow.order.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class FlashSaleOrderRequest {

    @NotNull
    private UUID flashSaleId;

    @Min(1)
    private int quantity;
}
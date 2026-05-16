package org.example.shopflow.flashsale.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.shopflow.flashsale.dto.request.CreateFlashSaleRequest;
import org.example.shopflow.flashsale.dto.response.FlashSaleResponse;
import org.example.shopflow.flashsale.entity.FlashSale;
import org.example.shopflow.flashsale.service.FlashSaleService;
import org.example.shopflow.shared.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashSaleResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Flash sale fetched",
                FlashSaleResponse.from(flashSaleService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashSaleResponse>> create(@Valid @RequestBody CreateFlashSaleRequest req) {
        FlashSale flashSale = flashSaleService.createFlashSale(
                req.getProductId(), req.getDiscountedPrice(),
                req.getQuantity(), req.getStartTime(), req.getEndTime());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flash sale created", FlashSaleResponse.from(flashSale)));
    }
}
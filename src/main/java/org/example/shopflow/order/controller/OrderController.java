package org.example.shopflow.order.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.shopflow.auth.security.UserPrincipal;
import org.example.shopflow.order.dto.request.FlashSaleOrderRequest;
import org.example.shopflow.order.dto.request.PlaceOrderRequest;
import org.example.shopflow.order.dto.response.OrderResponse;
import org.example.shopflow.order.entity.Order;
import org.example.shopflow.order.service.OrderService;
import org.example.shopflow.shared.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Normal purchase — Optimistic Locking (Req 1)
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PlaceOrderRequest request) {

        Order order = orderService.placeOrder(principal.getId(), request);
        OrderResponse response = OrderResponse.from(order);
        response.setMessage("Order placed. Invoice is being generated in the background.");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", response));
    }

    // Flash sale purchase — Pessimistic Locking (Req 1)
    @PostMapping("/flash-sale")
    public ResponseEntity<ApiResponse<OrderResponse>> placeFlashSaleOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody FlashSaleOrderRequest request) {

        Order order = orderService.placeFlashSaleOrder(
                principal.getId(), request.getFlashSaleId(), request.getQuantity());
        OrderResponse response = OrderResponse.from(order);
        response.setMessage("Flash sale order placed. Invoice is being generated in the background.");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flash sale order placed", response));
    }
}
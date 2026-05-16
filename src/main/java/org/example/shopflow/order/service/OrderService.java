package org.example.shopflow.order.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.order.dto.request.PlaceOrderRequest;
import org.example.shopflow.order.entity.Order;
import org.example.shopflow.order.entity.OrderItem;
import org.example.shopflow.order.entity.enums.OrderStatus;
import org.example.shopflow.order.event.OrderPlacedEvent;
import org.example.shopflow.order.repository.OrderRepository;
import org.example.shopflow.product.entity.Product;
import org.example.shopflow.product.strategy.OptimisticPurchaseStrategy;
import org.example.shopflow.product.strategy.PessimisticPurchaseStrategy;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OptimisticPurchaseStrategy optimisticStrategy;
    private final PessimisticPurchaseStrategy pessimisticStrategy;
    private final ApplicationEventPublisher eventPublisher;

    // Normal purchase — uses Optimistic Locking (Req 1)
    @Transactional
    public Order placeOrder(UUID userId, PlaceOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {
            // Strategy Pattern: OrderService delegates locking decision to the strategy
            Product product = optimisticStrategy.purchase(itemReq.getProductId(), itemReq.getQuantity());

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(subtotal);

            items.add(OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .subtotal(subtotal)
                    .build());
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CONFIRMED)
                .totalAmount(total)
                .build();

        order = orderRepository.save(order);

        for (OrderItem item : items) {
            item.setOrder(order);
        }
        order.getItems().addAll(items);
        order = orderRepository.save(order);

        // Req 3 — publish event; listener handles invoice async in background thread
        eventPublisher.publishEvent(new OrderPlacedEvent(this, order));
        log.info("Order {} placed for user {} — async invoice triggered", order.getId(), userId);

        return order;
    }

    // Flash sale purchase — uses Pessimistic Locking (Req 1)
    @Transactional
    public Order placeFlashSaleOrder(UUID userId, UUID flashSaleId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Strategy Pattern: same interface, different locking behavior
        Product product = pessimisticStrategy.purchase(flashSaleId, quantity);

        BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));

        OrderItem item = OrderItem.builder()
                .product(product)
                .quantity(quantity)
                .unitPrice(product.getPrice())
                .subtotal(subtotal)
                .build();

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CONFIRMED)
                .totalAmount(subtotal)
                .build();

        order = orderRepository.save(order);
        item.setOrder(order);
        order.getItems().add(item);
        order = orderRepository.save(order);

        eventPublisher.publishEvent(new OrderPlacedEvent(this, order));
        log.info("Flash sale order {} placed for user {}", order.getId(), userId);

        return order;
    }
}

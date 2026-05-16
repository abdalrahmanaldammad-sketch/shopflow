package org.example.shopflow.order.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.invoice.service.InvoiceService;
import org.example.shopflow.order.entity.Order;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

// Req 3 — Async Queue (Observer Pattern).
// @Async means this listener runs in a separate thread from the orderExecutor pool.
// The user's HTTP request returns immediately after the order is saved —
// invoice generation and email happen in the background without blocking the response.
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final InvoiceService invoiceService;

    @Async("orderExecutor")
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        Order order = event.getOrder();
        log.info("[ASYNC] Handling OrderPlacedEvent for order {} in thread {}", order.getId(), Thread.currentThread().getName());

        try {
            invoiceService.generateInvoice(order);
            log.info("[ASYNC] Invoice generated for order {}", order.getId());
        } catch (Exception ex) {
            log.error("[ASYNC] Failed to generate invoice for order {}: {}", order.getId(), ex.getMessage());
        }
    }
}
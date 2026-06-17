package org.example.shopflow.order.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.invoice.service.InvoiceService;
import org.example.shopflow.order.entity.Order;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

// Req 3 — Async Queue (Observer Pattern).
// @Async means this listener runs in a separate thread from the orderExecutor pool.
// The user's HTTP request returns immediately after the order is saved —
// invoice generation and email happen in the background without blocking the response.
//
// @TransactionalEventListener(AFTER_COMMIT): only fire once the order transaction has
// COMMITTED. With a plain @EventListener the invoice could be inserted before the order row
// is committed (or after a rollback), causing an FK violation under concurrent load.
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final InvoiceService invoiceService;

    @Async("orderExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
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
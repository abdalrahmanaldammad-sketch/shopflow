package org.example.shopflow.order.event;

import lombok.Getter;
import org.example.shopflow.order.entity.Order;
import org.springframework.context.ApplicationEvent;

// Req 3 — Async Queue (Observer Pattern).
// Published immediately after an order is confirmed.
// Listeners react asynchronously — the HTTP response is already sent
// to the user before invoice generation or email notification starts.
@Getter
public class OrderPlacedEvent extends ApplicationEvent {

    private final Order order;

    public OrderPlacedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }
}
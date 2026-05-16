package org.example.shopflow.invoice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.invoice.entity.Invoice;
import org.example.shopflow.invoice.entity.enums.InvoiceStatus;
import org.example.shopflow.invoice.repository.InvoiceRepository;
import org.example.shopflow.order.entity.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

// Req 3 — called asynchronously from OrderEventListener after order is placed.
// The user never waits for this — it runs in the background thread pool.
@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Transactional
    public void generateInvoice(Order order) {
        if (invoiceRepository.findByOrderId(order.getId()).isPresent()) {
            log.warn("Invoice already exists for order {}", order.getId());
            return;
        }

        String invoiceNumber = buildInvoiceNumber(order.getId());

        Invoice invoice = Invoice.builder()
                .order(order)
                .invoiceNumber(invoiceNumber)
                .totalAmount(order.getTotalAmount())
                .issuedAt(Instant.now())
                .status(InvoiceStatus.SENT)
                .build();

        invoiceRepository.save(invoice);
        log.info("Invoice {} generated for order {}", invoiceNumber, order.getId());
    }

    private String buildInvoiceNumber(UUID orderId) {
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
                .withZone(java.time.ZoneOffset.UTC)
                .format(Instant.now());
        return "INV-" + timestamp + "-" + orderId.toString().substring(0, 8).toUpperCase();
    }
}
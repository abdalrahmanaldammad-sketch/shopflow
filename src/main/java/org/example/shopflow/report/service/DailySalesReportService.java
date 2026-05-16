package org.example.shopflow.report.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.order.entity.Order;
import org.example.shopflow.order.entity.enums.OrderStatus;
import org.example.shopflow.order.repository.OrderRepository;
import org.example.shopflow.report.entity.DailySalesReport;
import org.example.shopflow.report.entity.enums.ReportStatus;
import org.example.shopflow.report.repository.DailySalesReportRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

// Req 4 — Batch Processing.
// Processes yesterday's orders in chunks of CHUNK_SIZE to avoid loading
// all rows into memory at once, preventing OutOfMemoryError under high volume.
@Service
@RequiredArgsConstructor
@Slf4j
public class DailySalesReportService {

    private static final int CHUNK_SIZE = 500;

    private final OrderRepository orderRepository;
    private final DailySalesReportRepository reportRepository;

    @Transactional
    public void generateReportForDate(LocalDate date) {
        if (reportRepository.existsByReportDate(date)) {
            log.info("Report for {} already exists — skipping", date);
            return;
        }

        DailySalesReport report = DailySalesReport.builder()
                .reportDate(date)
                .status(ReportStatus.PROCESSING)
                .build();
        report = reportRepository.save(report);

        Instant from = date.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant to = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        int page = 0;
        int totalOrders = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        Page<Order> chunk;

        try {
            do {
                // Req 4: fetch CHUNK_SIZE orders at a time — never loads all in memory
                chunk = orderRepository.findByStatusAndCreatedAtBetween(
                        OrderStatus.CONFIRMED, from, to,
                        PageRequest.of(page, CHUNK_SIZE)
                );

                List<Order> orders = chunk.getContent();
                totalOrders += orders.size();
                for (Order order : orders) {
                    totalRevenue = totalRevenue.add(order.getTotalAmount());
                }

                log.info("Batch chunk {} processed — {} orders in this chunk", page, orders.size());
                page++;

            } while (chunk.hasNext());

            report.setTotalOrders(totalOrders);
            report.setTotalRevenue(totalRevenue);
            report.setProcessedAt(Instant.now());
            report.setStatus(ReportStatus.COMPLETED);
            reportRepository.save(report);

            log.info("Daily report for {} completed — {} orders, revenue: {}", date, totalOrders, totalRevenue);

        } catch (Exception ex) {
            report.setStatus(ReportStatus.FAILED);
            reportRepository.save(report);
            log.error("Daily report for {} failed: {}", date, ex.getMessage());
        }
    }
}
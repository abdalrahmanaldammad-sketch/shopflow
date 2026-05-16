package org.example.shopflow.report.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.report.service.DailySalesReportService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

// Req 4 — Batch Processing background job.
// Runs every day at midnight UTC. Processes yesterday's orders in chunks
// via DailySalesReportService — never loads all orders into memory at once.
@Component
@RequiredArgsConstructor
@Slf4j
public class DailySalesJob {

    private final DailySalesReportService reportService;

    @Async("batchExecutor")
    @Scheduled(cron = "0 0 0 * * *", zone = "UTC")
    public void runDailyReport() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        log.info("[BATCH] Starting daily sales report for {} in thread {}", yesterday, Thread.currentThread().getName());
        reportService.generateReportForDate(yesterday);
    }
}
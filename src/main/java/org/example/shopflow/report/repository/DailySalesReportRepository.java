package org.example.shopflow.report.repository;

import org.example.shopflow.report.entity.DailySalesReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface DailySalesReportRepository extends JpaRepository<DailySalesReport, UUID> {
    Optional<DailySalesReport> findByReportDate(LocalDate date);
    boolean existsByReportDate(LocalDate date);
}
package org.example.shopflow.order.repository;

import org.example.shopflow.order.entity.Order;
import org.example.shopflow.order.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Req 4 — Batch Processing: paginated query used by DailySalesJob to
    // process confirmed orders in chunks without loading all into memory.
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt >= :from AND o.createdAt < :to")
    Page<Order> findByStatusAndCreatedAtBetween(
            @Param("status") OrderStatus status,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );
}
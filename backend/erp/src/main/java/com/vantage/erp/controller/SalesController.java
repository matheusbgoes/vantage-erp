package com.vantage.erp.controller;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/sales")
@Tag(name = "Sales", description = "APIs for sales dashboard")
public class SalesController {

    @GetMapping
    @Operation(summary = "Get sales", description = "Retrieve recent sales")
    public ResponseEntity<List<SaleResponse>> getSales() {
        // TODO: Replace mocked MVP data with a real JPA Repository integration in the production sprint.
        return ResponseEntity.ok(List.of(
                new SaleResponse(1L, "VEN-1001", "MacBook Pro", 1, new BigDecimal("14299.90"), "PAID", OffsetDateTime.now().minusDays(4)),
                new SaleResponse(2L, "VEN-1002", "Monitor 4K", 2, new BigDecimal("5798.00"), "PAID", OffsetDateTime.now().minusDays(2)),
                new SaleResponse(3L, "VEN-1003", "Hub USB-C", 3, new BigDecimal("538.50"), "PENDING", OffsetDateTime.now().minusDays(1)),
                new SaleResponse(4L, "VEN-1004", "Mouse Ergonomico", 4, new BigDecimal("879.60"), "PAID", OffsetDateTime.now().minusHours(8))
        ));
    }

    public record SaleResponse(
            Long id,
            String code,
            String productName,
            Integer quantity,
            BigDecimal total,
            String status,
            OffsetDateTime soldAt) {
    }
}

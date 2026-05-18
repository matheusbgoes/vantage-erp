package com.vantage.erp.controller;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "APIs for inventory movements")
public class InventoryController {

    @GetMapping
    @Operation(summary = "Get inventory movements", description = "Retrieve recent stock movements")
    public ResponseEntity<List<InventoryMovementResponse>> getInventoryMovements() {
        // TODO: Replace mocked MVP data with a real JPA Repository integration in the production sprint.
        return ResponseEntity.ok(List.of(
                new InventoryMovementResponse(1L, 1L, "MacBook Pro", "ENTRY", 5, "Compra fornecedor", OffsetDateTime.now().minusDays(3)),
                new InventoryMovementResponse(2L, 3L, "Monitor 4K", "EXIT", 2, "Venda corporativa", OffsetDateTime.now().minusDays(2)),
                new InventoryMovementResponse(3L, 2L, "Teclado Mecanico", "ENTRY", 12, "Reposicao preventiva", OffsetDateTime.now().minusDays(1)),
                new InventoryMovementResponse(4L, 5L, "Mouse Ergonomico", "EXIT", 4, "Pedido e-commerce", OffsetDateTime.now().minusHours(6))
        ));
    }

    public record InventoryMovementResponse(
            Long id,
            Long productId,
            String productName,
            String type,
            Integer quantity,
            String reason,
            OffsetDateTime createdAt) {
    }
}

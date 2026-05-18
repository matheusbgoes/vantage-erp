package com.vantage.erp.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * DTO for returning product data in API responses.
 * Used to avoid exposing the @Entity directly to clients.
 */
public record ProductResponseDTO(
    Long id,
    String name,
    Integer stockQuantity,
    BigDecimal price,
    Integer minStockLevel,
    OffsetDateTime createdAt
) {
}

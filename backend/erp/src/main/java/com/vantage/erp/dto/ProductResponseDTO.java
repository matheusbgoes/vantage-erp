package com.vantage.erp.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for returning product data in API responses.
 * Used to avoid exposing the @Entity directly to clients.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {

    private Long id;
    private String name;
    private Integer stockQuantity;
    private BigDecimal price;
    private Integer minStockLevel;
    private OffsetDateTime createdAt;
}

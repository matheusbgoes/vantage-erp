package com.vantage.erp.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO for creating or updating a product.
 * Used as input in API endpoints to avoid exposing the @Entity directly.
 */
public record ProductRequestDTO(
    @NotBlank(message = "O nome do produto não pode ser vazio")
    String name,

    @NotNull(message = "A quantidade em estoque é obrigatória")
    @PositiveOrZero(message = "A quantidade em estoque não pode ser negativa")
    Integer stockQuantity,

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser positivo")
    BigDecimal price,

    @NotNull(message = "O nível mínimo de estoque é obrigatório")
    @PositiveOrZero(message = "O nível mínimo de estoque não pode ser negativo")
    Integer minStockLevel
) {
}

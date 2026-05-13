package com.vantage.erp.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto não pode ser vazio")
    private String name;

    @NotNull(message = "A quantidade em estoque é obrigatória")
    @PositiveOrZero(message = "A quantidade em estoque não pode ser negativa")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser positivo")
    @Column(nullable = false)
    private BigDecimal price;

    @NotNull(message = "O nível mínimo de estoque é obrigatório")
    @PositiveOrZero(message = "O nível mínimo de estoque não pode ser negativo")
    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private OffsetDateTime createdAt;
}

package com.vantage.erp.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Objects;

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

    public Product() {
    }

    public Product(String name, Integer stockQuantity, BigDecimal price, Integer minStockLevel) {
        this.name = name;
        this.stockQuantity = stockQuantity;
        this.price = price;
        this.minStockLevel = minStockLevel;
    }

    public Product(Long id, String name, Integer stockQuantity, BigDecimal price, Integer minStockLevel, OffsetDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.stockQuantity = stockQuantity;
        this.price = price;
        this.minStockLevel = minStockLevel;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id) &&
               Objects.equals(name, product.name) &&
               Objects.equals(stockQuantity, product.stockQuantity) &&
               Objects.equals(price, product.price) &&
               Objects.equals(minStockLevel, product.minStockLevel) &&
               Objects.equals(createdAt, product.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, stockQuantity, price, minStockLevel, createdAt);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", stockQuantity=" + stockQuantity +
                ", price=" + price +
                ", minStockLevel=" + minStockLevel +
                ", createdAt=" + createdAt +
                '}';
    }
}

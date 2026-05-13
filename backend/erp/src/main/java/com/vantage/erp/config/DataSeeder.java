package com.vantage.erp.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.vantage.erp.model.Product;
import com.vantage.erp.repository.ProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.saveAll(List.of(
            new Product(null, "MacBook Pro", 8, new BigDecimal("14299.90"), 5, null),
            new Product(null, "Teclado Mecânico", 16, new BigDecimal("429.90"), 10, null),
            new Product(null, "Monitor 4K", 3, new BigDecimal("2899.00"), 8, null),
            new Product(null, "Hub USB-C", 12, new BigDecimal("179.50"), 5, null),
            new Product(null, "Mouse Ergonômico", 24, new BigDecimal("219.90"), 6, null)
        ));
    }
}

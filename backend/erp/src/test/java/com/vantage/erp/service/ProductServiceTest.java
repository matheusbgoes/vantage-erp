package com.vantage.erp.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vantage.erp.model.Product;
import com.vantage.erp.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void shouldReturnTrueWhenStockIsAtOrBelowMinimumLevel() {
        Product product = new Product();
        product.setStockQuantity(3);
        product.setMinStockLevel(5);

        assertTrue(productService.isStockCritical(product));
    }

    @Test
    void shouldReturnFalseWhenStockIsAboveMinimumLevel() {
        Product product = new Product();
        product.setStockQuantity(10);
        product.setMinStockLevel(5);

        assertFalse(productService.isStockCritical(product));
    }
}

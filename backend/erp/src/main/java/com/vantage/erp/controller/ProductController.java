package com.vantage.erp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vantage.erp.model.ForecastPrediction;
import com.vantage.erp.model.Product;
import com.vantage.erp.service.ForecastingService;
import com.vantage.erp.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService;
    private final ForecastingService forecastingService;

    public ProductController(ProductService productService, ForecastingService forecastingService) {
        this.productService = productService;
        this.forecastingService = forecastingService;
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve a list of all products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping
    @Operation(summary = "Create a new product", description = "Create a new product with the provided details")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product", description = "Update an existing product by its ID")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.update(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/predict")
    @Operation(summary = "Predict stock depletion", description = "Returns a simple AI-based stock depletion prediction for a product")
    public ResponseEntity<ForecastPrediction> getForecast(@PathVariable Long id) {
        return forecastingService.predict(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/forecast-summary")
    @Operation(summary = "Get forecast summary", description = "List all products forecasted to deplete in less than 7 days")
    public ResponseEntity<List<ForecastPrediction>> getForecastSummary() {
        return ResponseEntity.ok(forecastingService.forecastSummary());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product", description = "Delete a product by its ID")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

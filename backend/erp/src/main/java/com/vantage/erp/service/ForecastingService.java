package com.vantage.erp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.vantage.erp.model.ForecastPrediction;
import com.vantage.erp.model.Product;
import com.vantage.erp.repository.ProductRepository;

@Service
public class ForecastingService {

    private final ProductRepository productRepository;

    public ForecastingService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Optional<ForecastPrediction> predict(Long productId) {
        return productRepository.findById(productId).map(this::generatePrediction);
    }

    public List<ForecastPrediction> forecastSummary() {
        return productRepository.findAll().stream()
                .map(this::generatePrediction)
                .filter(prediction -> prediction.getEstimatedDaysToDepletion() < 7)
                .collect(Collectors.toList());
    }

    private ForecastPrediction generatePrediction(Product product) {
        double dailyUsage = calculateDailyUsage(product);
        int estimatedDays = (int) Math.ceil(product.getStockQuantity() / dailyUsage);
        if (estimatedDays < 1) {
            estimatedDays = 1;
        }

        String note = product.getStockQuantity() <= product.getMinStockLevel()
                ? "Repor imediatamente"
                : estimatedDays <= 7
                        ? "Repor em breve"
                        : "Estoque estável";

        return new ForecastPrediction(product.getId(), estimatedDays, note, product.getStockQuantity() <= product.getMinStockLevel());
    }

    private double calculateDailyUsage(Product product) {
        int stock = product.getStockQuantity();
        int minLevel = product.getMinStockLevel();
        double demandIndex = Math.max(1.0, (minLevel * 0.75) + 1.0);
        double momentum = Math.max(1.0, (stock / 5.0));
        return Math.max(1.0, (demandIndex + momentum) / 2.0);
    }
}

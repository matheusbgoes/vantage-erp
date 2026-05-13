package com.vantage.erp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForecastPrediction {
    private Long productId;
    private int estimatedDaysToDepletion;
    private String forecastNote;
    private boolean critical;
}

package com.vantage.erp.model;

import java.util.Objects;

public class ForecastPrediction {
    private Long productId;
    private int estimatedDaysToDepletion;
    private String forecastNote;
    private boolean critical;

    public ForecastPrediction() {
    }

    public ForecastPrediction(Long productId, int estimatedDaysToDepletion, String forecastNote, boolean critical) {
        this.productId = productId;
        this.estimatedDaysToDepletion = estimatedDaysToDepletion;
        this.forecastNote = forecastNote;
        this.critical = critical;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getEstimatedDaysToDepletion() {
        return estimatedDaysToDepletion;
    }

    public void setEstimatedDaysToDepletion(int estimatedDaysToDepletion) {
        this.estimatedDaysToDepletion = estimatedDaysToDepletion;
    }

    public String getForecastNote() {
        return forecastNote;
    }

    public void setForecastNote(String forecastNote) {
        this.forecastNote = forecastNote;
    }

    public boolean isCritical() {
        return critical;
    }

    public void setCritical(boolean critical) {
        this.critical = critical;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ForecastPrediction that = (ForecastPrediction) o;
        return estimatedDaysToDepletion == that.estimatedDaysToDepletion &&
               critical == that.critical &&
               Objects.equals(productId, that.productId) &&
               Objects.equals(forecastNote, that.forecastNote);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, estimatedDaysToDepletion, forecastNote, critical);
    }

    @Override
    public String toString() {
        return "ForecastPrediction{" +
                "productId=" + productId +
                ", estimatedDaysToDepletion=" + estimatedDaysToDepletion +
                ", forecastNote='" + forecastNote + '\'' +
                ", critical=" + critical +
                '}';
    }
}

package com.ims.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {
    private long totalProducts;
    private BigDecimal totalValue;
    private int lowStockCount;
    private List<TransactionDto> recentTransactions;

    public DashboardDto() {}

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    public int getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(int lowStockCount) { this.lowStockCount = lowStockCount; }
    public List<TransactionDto> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<TransactionDto> recentTransactions) { this.recentTransactions = recentTransactions; }
}

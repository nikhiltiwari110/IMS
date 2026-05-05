package com.ims.backend.service;

import com.ims.backend.dto.DashboardDto;
import com.ims.backend.dto.TransactionDto;
import com.ims.backend.entity.Transaction;
import com.ims.backend.repository.ProductRepository;
import com.ims.backend.repository.StockLevelRepository;
import com.ims.backend.repository.TransactionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final ProductRepository productRepository;
    private final StockLevelRepository stockLevelRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(ProductRepository productRepository, 
                            StockLevelRepository stockLevelRepository, 
                            TransactionRepository transactionRepository) {
        this.productRepository = productRepository;
        this.stockLevelRepository = stockLevelRepository;
        this.transactionRepository = transactionRepository;
    }

    public DashboardDto getSummary() {
        long totalProducts = productRepository.count();
        
        BigDecimal totalValue = stockLevelRepository.findAll().stream()
                .map(s -> s.getProduct().getPrice().multiply(new BigDecimal(s.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        int lowStockCount = productRepository.findLowStockProducts().size();
        
        List<TransactionDto> recentTransactions = transactionRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "timestamp")))
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
                
        DashboardDto dto = new DashboardDto();
        dto.setTotalProducts(totalProducts);
        dto.setTotalValue(totalValue);
        dto.setLowStockCount(lowStockCount);
        dto.setRecentTransactions(recentTransactions);
        return dto;
    }

    private TransactionDto toDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setProductId(transaction.getProduct().getId());
        dto.setProductName(transaction.getProduct().getName());
        dto.setType(transaction.getType());
        dto.setQuantity(transaction.getQuantity());
        dto.setNote(transaction.getNote());
        if (transaction.getPerformedBy() != null) {
            dto.setPerformedById(transaction.getPerformedBy().getId());
            dto.setPerformedByName(transaction.getPerformedBy().getName());
        }
        dto.setTimestamp(transaction.getTimestamp());
        return dto;
    }
}

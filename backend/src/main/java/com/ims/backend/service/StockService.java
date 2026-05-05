package com.ims.backend.service;

import com.ims.backend.dto.StockLevelDto;
import com.ims.backend.dto.TransactionDto;
import com.ims.backend.entity.Product;
import com.ims.backend.entity.StockLevel;
import com.ims.backend.entity.Transaction;
import com.ims.backend.repository.ProductRepository;
import com.ims.backend.repository.StockLevelRepository;
import com.ims.backend.repository.TransactionRepository;
import com.ims.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {
    private final StockLevelRepository stockLevelRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public StockService(StockLevelRepository stockLevelRepository, 
                        ProductRepository productRepository, 
                        TransactionRepository transactionRepository, 
                        UserRepository userRepository) {
        this.stockLevelRepository = stockLevelRepository;
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public List<StockLevelDto> getAllStockLevels(boolean lowStock) {
        if (lowStock) {
            return stockLevelRepository.findLowStockLevels().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
        }
        return stockLevelRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void processStockTransaction(TransactionDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                
        StockLevel stockLevel = stockLevelRepository.findByProductId(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Stock level not found for product"));

        int newQuantity = stockLevel.getQuantity();

        switch (dto.getType()) {
            case STOCK_IN:
                newQuantity += dto.getQuantity();
                break;
            case STOCK_OUT:
                if (newQuantity - dto.getQuantity() < 0) {
                    throw new IllegalArgumentException("Stock cannot go below zero. Current stock: " + newQuantity);
                }
                newQuantity -= dto.getQuantity();
                break;
            case ADJUSTMENT:
                if (newQuantity + dto.getQuantity() < 0) {
                    throw new IllegalArgumentException("Stock cannot go below zero.");
                }
                newQuantity += dto.getQuantity();
                break;
        }

        stockLevel.setQuantity(newQuantity);
        stockLevelRepository.save(stockLevel);

        Transaction transaction = new Transaction();
        transaction.setProduct(product);
        transaction.setType(dto.getType());
        transaction.setQuantity(dto.getQuantity());
        transaction.setNote(dto.getNote());
        
        if (dto.getPerformedById() != null) {
            transaction.setPerformedBy(userRepository.findById(dto.getPerformedById()).orElse(null));
        }

        transactionRepository.save(transaction);
    }

    private StockLevelDto toDto(StockLevel stockLevel) {
        StockLevelDto dto = new StockLevelDto();
        dto.setId(stockLevel.getId());
        dto.setProductId(stockLevel.getProduct().getId());
        dto.setProductName(stockLevel.getProduct().getName());
        dto.setQuantity(stockLevel.getQuantity());
        dto.setWarehouseLocation(stockLevel.getWarehouseLocation());
        return dto;
    }
}

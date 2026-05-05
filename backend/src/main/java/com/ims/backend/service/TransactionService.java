package com.ims.backend.service;

import com.ims.backend.dto.TransactionDto;
import com.ims.backend.entity.Transaction;
import com.ims.backend.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Page<TransactionDto> getTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(this::toDto);
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

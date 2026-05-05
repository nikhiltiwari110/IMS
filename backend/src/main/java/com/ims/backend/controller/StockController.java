package com.ims.backend.controller;

import com.ims.backend.dto.StockLevelDto;
import com.ims.backend.dto.TransactionDto;
import com.ims.backend.entity.TransactionType;
import com.ims.backend.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<StockLevelDto>> getAllStockLevels(@RequestParam(required = false, defaultValue = "false") boolean lowStock) {
        return ResponseEntity.ok(stockService.getAllStockLevels(lowStock));
    }

    @PostMapping("/in")
    public ResponseEntity<Void> stockIn(@Valid @RequestBody TransactionDto dto) {
        dto.setType(TransactionType.STOCK_IN);
        stockService.processStockTransaction(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/out")
    public ResponseEntity<Void> stockOut(@Valid @RequestBody TransactionDto dto) {
        dto.setType(TransactionType.STOCK_OUT);
        stockService.processStockTransaction(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/adjust")
    public ResponseEntity<Void> stockAdjust(@Valid @RequestBody TransactionDto dto) {
        dto.setType(TransactionType.ADJUSTMENT);
        stockService.processStockTransaction(dto);
        return ResponseEntity.ok().build();
    }
}
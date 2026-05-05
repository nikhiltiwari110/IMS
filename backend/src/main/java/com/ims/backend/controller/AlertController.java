package com.ims.backend.controller;

import com.ims.backend.dto.StockLevelDto;
import com.ims.backend.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    private final StockService stockService;

    public AlertController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<StockLevelDto>> getLowStockAlerts() {
        return ResponseEntity.ok(stockService.getAllStockLevels(true));
    }
}

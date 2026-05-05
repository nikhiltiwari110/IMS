package com.ims.backend.repository;

import com.ims.backend.entity.StockLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockLevelRepository extends JpaRepository<StockLevel, Long> {
    Optional<StockLevel> findByProductId(Long productId);
    
    @Query("SELECT s FROM StockLevel s JOIN FETCH s.product p WHERE s.quantity <= p.reorderLevel")
    List<StockLevel> findLowStockLevels();
}
package com.ims.backend.repository;

import com.ims.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);
    
    @Query("SELECT p FROM Product p LEFT JOIN StockLevel s ON s.product.id = p.id WHERE COALESCE(s.quantity, 0) <= p.reorderLevel")
    List<Product> findLowStockProducts();

    @Query(value = "SELECT p.* FROM products p WHERE p.id NOT IN (SELECT t.product_id FROM transactions t WHERE t.timestamp > :date)", nativeQuery = true)
    List<Product> findDeadStockSince(@Param("date") ZonedDateTime date);
}

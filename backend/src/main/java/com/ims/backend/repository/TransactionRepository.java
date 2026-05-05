package com.ims.backend.repository;

import com.ims.backend.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    
    @Query("SELECT t.product.id, SUM(t.quantity) as totalQty FROM Transaction t WHERE t.type = 'STOCK_OUT' GROUP BY t.product.id ORDER BY totalQty DESC")
    List<Object[]> findTopSellingProductsIdsAndQuantities(Pageable pageable);
}
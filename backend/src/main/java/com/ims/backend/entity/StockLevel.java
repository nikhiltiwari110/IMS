package com.ims.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_levels")
public class StockLevel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity = 0;
    
    private String warehouseLocation;

    public StockLevel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }
}

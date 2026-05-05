package com.ims.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by")
    private User performedBy;
    
    @CreationTimestamp
    @Column(updatable = false)
    private ZonedDateTime timestamp;

    public Transaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public User getPerformedBy() { return performedBy; }
    public void setPerformedBy(User performedBy) { this.performedBy = performedBy; }
    public ZonedDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(ZonedDateTime timestamp) { this.timestamp = timestamp; }
}

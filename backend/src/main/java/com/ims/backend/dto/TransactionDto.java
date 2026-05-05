package com.ims.backend.dto;

import com.ims.backend.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.ZonedDateTime;

public class TransactionDto {
    private Long id;
    @NotNull
    private Long productId;
    private String productName;
    private TransactionType type;
    @NotNull
    @Positive
    private Integer quantity;
    private String note;
    private Long performedById;
    private String performedByName;
    private ZonedDateTime timestamp;

    public TransactionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public Long getPerformedById() { return performedById; }
    public void setPerformedById(Long performedById) { this.performedById = performedById; }
    public String getPerformedByName() { return performedByName; }
    public void setPerformedByName(String performedByName) { this.performedByName = performedByName; }
    public ZonedDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(ZonedDateTime timestamp) { this.timestamp = timestamp; }
}

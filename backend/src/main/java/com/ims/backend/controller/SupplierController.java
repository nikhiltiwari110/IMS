package com.ims.backend.controller;

import com.ims.backend.dto.SupplierDto;
import com.ims.backend.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<List<SupplierDto>> getAll() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @PostMapping
    public ResponseEntity<SupplierDto> create(@Valid @RequestBody SupplierDto dto) {
        return ResponseEntity.ok(supplierService.createSupplier(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto> update(@PathVariable Long id, @Valid @RequestBody SupplierDto dto) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
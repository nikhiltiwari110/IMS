package com.ims.backend.service;

import com.ims.backend.dto.ProductDto;
import com.ims.backend.entity.Product;
import com.ims.backend.entity.StockLevel;
import com.ims.backend.repository.CategoryRepository;
import com.ims.backend.repository.ProductRepository;
import com.ims.backend.repository.StockLevelRepository;
import com.ims.backend.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final StockLevelRepository stockLevelRepository;

    public ProductService(ProductRepository productRepository, 
                          CategoryRepository categoryRepository, 
                          SupplierRepository supplierRepository, 
                          StockLevelRepository stockLevelRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.stockLevelRepository = stockLevelRepository;
    }

    public Page<ProductDto> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toDto);
    }

    public ProductDto getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    public ProductDto createProduct(ProductDto dto) {
        if (dto.getSku() == null || dto.getSku().isBlank()) {
            dto.setSku("PRD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else if (productRepository.existsBySku(dto.getSku())) {
            throw new IllegalArgumentException("SKU already exists");
        }

        Product product = toEntity(dto);
        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId()).orElse(null));
        }
        if (dto.getSupplierId() != null) {
            product.setSupplier(supplierRepository.findById(dto.getSupplierId()).orElse(null));
        }
        
        product = productRepository.save(product);

        // Auto-create initial stock level 0
        StockLevel stockLevel = new StockLevel();
        stockLevel.setProduct(product);
        stockLevel.setQuantity(0);
        stockLevelRepository.save(stockLevel);

        return toDto(product);
    }

    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setReorderLevel(dto.getReorderLevel());
        
        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId()).orElse(null));
        } else {
            product.setCategory(null);
        }
        
        if (dto.getSupplierId() != null) {
            product.setSupplier(supplierRepository.findById(dto.getSupplierId()).orElse(null));
        } else {
            product.setSupplier(null);
        }

        return toDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setReorderLevel(product.getReorderLevel());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }
        if (product.getSupplier() != null) {
            dto.setSupplierId(product.getSupplier().getId());
        }
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }

    private Product toEntity(ProductDto dto) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        if (dto.getReorderLevel() != null) {
            product.setReorderLevel(dto.getReorderLevel());
        }
        return product;
    }
}

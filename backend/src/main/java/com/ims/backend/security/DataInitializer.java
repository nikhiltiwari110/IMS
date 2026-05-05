package com.ims.backend.security;

import com.ims.backend.entity.*;
import com.ims.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, 
                           CategoryRepository categoryRepository, 
                           SupplierRepository supplierRepository, 
                           ProductRepository productRepository, 
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) return;

        // Seed Categories
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Gadgets and devices");
        categoryRepository.save(electronics);

        Category furniture = new Category();
        furniture.setName("Furniture");
        furniture.setDescription("Office and home furniture");
        categoryRepository.save(furniture);

        // Seed Suppliers
        Supplier techSupply = new Supplier();
        techSupply.setName("Tech Corp");
        techSupply.setEmail("contact@techcorp.com");
        supplierRepository.save(techSupply);

        // Seed Products
        Product laptop = new Product();
        laptop.setName("MacBook Pro");
        laptop.setSku("LAP-001");
        laptop.setPrice(java.math.BigDecimal.valueOf(1999.99));
        laptop.setReorderLevel(5);
        laptop.setCategory(electronics);
        laptop.setSupplier(techSupply);
        productRepository.save(laptop);

        Product chair = new Product();
        chair.setName("Office Chair");
        chair.setSku("FUR-001");
        chair.setPrice(java.math.BigDecimal.valueOf(150.00));
        chair.setReorderLevel(10);
        chair.setCategory(furniture);
        chair.setSupplier(techSupply);
        productRepository.save(chair);

        System.out.println("--- Database Seeded with Sample Data ---");
    }
}

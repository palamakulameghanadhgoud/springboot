package com.example.store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.store.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByProductNameIgnoreCase(String productName);
}

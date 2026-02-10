package com.example.store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.store.entity.Product;
import com.example.store.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public Product save(Product product) {
        if (product.getProductName() != null && !product.getProductName().isBlank()
                && repo.findByProductNameIgnoreCase(product.getProductName().trim()).isPresent()) {
            throw new DuplicateException("Product with name '" + product.getProductName() + "' already exists");
        }
        return repo.save(product);
    }

    public List<Product> getAll() {
        return repo.findAll();
    }
}

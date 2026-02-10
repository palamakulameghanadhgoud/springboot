package com.example.store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.store.entity.Customer;
import com.example.store.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public Customer save(Customer customer) {
        if (customer.getEmail() != null && !customer.getEmail().isBlank()
                && repo.findByEmailIgnoreCase(customer.getEmail().trim()).isPresent()) {
            throw new DuplicateException("Customer with email '" + customer.getEmail() + "' already exists");
        }
        return repo.save(customer);
    }

    public List<Customer> getAll() {
        return repo.findAll();
    }
}

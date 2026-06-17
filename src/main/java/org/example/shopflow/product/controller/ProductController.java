package org.example.shopflow.product.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.shopflow.product.dto.request.CreateProductRequest;
import org.example.shopflow.product.dto.response.ProductResponse;
import org.example.shopflow.product.entity.Product;
import org.example.shopflow.product.service.ProductService;
import org.example.shopflow.shared.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Products fetched", productService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Product fetched", productService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", ProductResponse.from(productService.create(product))));
    }
}
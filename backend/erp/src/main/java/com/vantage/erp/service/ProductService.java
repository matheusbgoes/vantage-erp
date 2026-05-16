package com.vantage.erp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.vantage.erp.dto.ProductRequestDTO;
import com.vantage.erp.dto.ProductResponseDTO;
import com.vantage.erp.model.Product;
import com.vantage.erp.repository.ProductRepository;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Retrieves all products and converts them to DTOs.
     * @return List of ProductResponseDTO
     */
    public List<ProductResponseDTO> findAll() {
        logger.info("Buscando todos os produtos");
        return productRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public Optional<Product> findById(Long id) {
        logger.info("Buscando produto com id={}", id);
        return productRepository.findById(id);
    }

    public boolean isStockCritical(Product product) {
        if (product == null) {
            return false;
        }
        return product.getStockQuantity() <= product.getMinStockLevel();
    }

    /**
     * Saves a new product from DTO and returns the saved product as DTO.
     * @param productRequest DTO with product data
     * @return ProductResponseDTO of the saved product
     */
    public ProductResponseDTO save(ProductRequestDTO productRequest) {
        logger.info("Salvando novo produto: nome='{}', estoque={}, preço={}", productRequest.getName(), productRequest.getStockQuantity(), productRequest.getPrice());
        Product product = toEntity(productRequest);
        Product savedProduct = productRepository.save(product);
        return toResponseDTO(savedProduct);
    }

    /**
     * Updates an existing product from DTO and returns the updated product as DTO.
     * @param id Product ID
     * @param productDetails DTO with updated product data
     * @return ProductResponseDTO of the updated product
     * @throws RuntimeException if product not found
     */
    public ProductResponseDTO update(Long id, ProductRequestDTO productDetails) {
        logger.info("Atualizando produto id={}", id);
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            BeanUtils.copyProperties(productDetails, product, "id", "createdAt");
            Product updatedProduct = productRepository.save(product);
            logger.info("Produto atualizado: id={}, nome='{}'", updatedProduct.getId(), updatedProduct.getName());
            return toResponseDTO(updatedProduct);
        } else {
            logger.warn("Produto não encontrado para atualização: id={}", id);
            throw new RuntimeException("Product not found with id " + id);
        }
    }

    public void deleteById(Long id) {
        logger.info("Excluindo produto id={}", id);
        productRepository.deleteById(id);
    }

    /**
     * Converts ProductRequestDTO to Product entity.
     * @param dto DTO with product data
     * @return Product entity
     */
    private Product toEntity(ProductRequestDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setStockQuantity(dto.getStockQuantity());
        product.setPrice(dto.getPrice());
        product.setMinStockLevel(dto.getMinStockLevel());
        return product;
    }

    /**
     * Converts Product entity to ProductResponseDTO.
     * @param product Product entity
     * @return ProductResponseDTO
     */
    private ProductResponseDTO toResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .stockQuantity(product.getStockQuantity())
                .price(product.getPrice())
                .minStockLevel(product.getMinStockLevel())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
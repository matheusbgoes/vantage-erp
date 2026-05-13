package com.vantage.erp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.vantage.erp.model.Product;
import com.vantage.erp.repository.ProductRepository;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() {
        logger.info("Buscando todos os produtos");
        return productRepository.findAll();
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

    public Product save(Product product) {
        logger.info("Salvando novo produto: nome='{}', estoque={}, preço={}", product.getName(), product.getStockQuantity(), product.getPrice());
        return productRepository.save(product);
    }

    public Product update(Long id, Product productDetails) {
        logger.info("Atualizando produto id={}", id);
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            BeanUtils.copyProperties(productDetails, product, "id", "createdAt");
            Product updatedProduct = productRepository.save(product);
            logger.info("Produto atualizado: id={}, nome='{}'", updatedProduct.getId(), updatedProduct.getName());
            return updatedProduct;
        } else {
            logger.warn("Produto não encontrado para atualização: id={}", id);
            throw new RuntimeException("Product not found with id " + id);
        }
    }

    public void deleteById(Long id) {
        logger.info("Excluindo produto id={}", id);
        productRepository.deleteById(id);
    }
}
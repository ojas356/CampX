package com.campx.repository

import com.campx.model.Product
import com.campx.model.ProductStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ProductRepository : JpaRepository<Product, Long> {
    fun findByStatusOrderByCreatedAtDesc(status: ProductStatus): List<Product>
    fun findByStudentIdAndStatusOrderByCreatedAtDesc(studentId: Long, status: ProductStatus): List<Product>
    fun findByStudentIdOrderByCreatedAtDesc(studentId: Long): List<Product>

    @Query(
        """
        SELECT p FROM Product p
        WHERE p.status = 'ACTIVE'
        AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
        AND (:query IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
        ORDER BY p.createdAt DESC
        """
    )
    fun searchActiveProducts(category: String?, query: String?): List<Product>
}

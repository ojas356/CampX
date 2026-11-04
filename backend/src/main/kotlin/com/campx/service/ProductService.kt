package com.campx.service

import com.campx.dto.ProductRequest
import com.campx.dto.ProductResponse
import com.campx.dto.SellerSummaryDto
import com.campx.model.Product
import com.campx.model.ProductStatus
import com.campx.repository.ProductRepository
import com.campx.repository.StudentRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val studentRepository: StudentRepository
) {

    fun getActiveProducts(category: String?, query: String?): List<ProductResponse> {
        val products = if (category.isNullOrBlank() && query.isNullOrBlank()) {
            productRepository.findByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE)
        } else {
            productRepository.searchActiveProducts(
                category = category?.takeIf { it.isNotBlank() },
                query = query?.takeIf { it.isNotBlank() }
            )
        }
        return products.map { toResponse(it) }
    }

    fun getProductById(id: Long): ProductResponse {
        val product = productRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id $id") }
        return toResponse(product)
    }

    @Transactional
    fun createProduct(studentId: Long, request: ProductRequest): ProductResponse {
        val student = studentRepository.findById(studentId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated student not found") }

        val product = Product(
            productName = request.productName.trim(),
            description = request.description.trim(),
            category = request.category.trim(),
            price = request.price,
            condition = request.condition,
            imageUrl = request.imageUrl?.trim(),
            location = request.location.trim(),
            status = ProductStatus.ACTIVE,
            student = student
        )

        val saved = productRepository.save(product)
        return toResponse(saved)
    }

    @Transactional
    fun updateProduct(productId: Long, currentStudentId: Long, request: ProductRequest): ProductResponse {
        val product = productRepository.findById(productId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found") }

        // Enforce ownership: only the owner can update
        if (product.student.id != currentStudentId) {
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Unauthorized: You can only edit your own listings."
            )
        }

        product.productName = request.productName.trim()
        product.description = request.description.trim()
        product.category = request.category.trim()
        product.price = request.price
        product.condition = request.condition
        product.imageUrl = request.imageUrl?.trim()
        product.location = request.location.trim()

        val updated = productRepository.save(product)
        return toResponse(updated)
    }

    @Transactional
    fun deleteProduct(productId: Long, currentStudentId: Long) {
        val product = productRepository.findById(productId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found") }

        // Enforce ownership: only the owner can delete
        if (product.student.id != currentStudentId) {
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Unauthorized: You can only delete your own listings."
            )
        }

        productRepository.delete(product)
    }

    @Transactional
    fun markAsSold(productId: Long, currentStudentId: Long): ProductResponse {
        val product = productRepository.findById(productId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found") }

        // Enforce ownership: only the owner can mark as sold
        if (product.student.id != currentStudentId) {
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Unauthorized: You can only mark your own listings as sold."
            )
        }

        product.status = ProductStatus.SOLD
        val updated = productRepository.save(product)
        return toResponse(updated)
    }

    fun getStudentListings(studentId: Long, status: ProductStatus?): List<ProductResponse> {
        val listings = if (status != null) {
            productRepository.findByStudentIdAndStatusOrderByCreatedAtDesc(studentId, status)
        } else {
            productRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
        }
        return listings.map { toResponse(it) }
    }

    private fun toResponse(product: Product): ProductResponse {
        return ProductResponse(
            id = product.id!!,
            productName = product.productName,
            description = product.description,
            category = product.category,
            price = product.price,
            condition = product.condition,
            imageUrl = product.imageUrl,
            location = product.location,
            status = product.status,
            seller = SellerSummaryDto(
                id = product.student.id!!,
                name = product.student.name,
                collegeEmail = product.student.collegeEmail,
                phoneNumber = product.student.phoneNumber
            ),
            createdAt = product.createdAt,
            updatedAt = product.updatedAt
        )
    }
}

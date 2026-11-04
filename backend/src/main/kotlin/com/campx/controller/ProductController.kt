package com.campx.controller

import com.campx.dto.ProductRequest
import com.campx.dto.ProductResponse
import com.campx.model.ProductStatus
import com.campx.security.StudentPrincipal
import com.campx.service.ProductService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/products")
class ProductController(
    private val productService: ProductService
) {

    @GetMapping
    fun getActiveProducts(
        @RequestParam(required = false) category: String?,
        @RequestParam(required = false) query: String?
    ): ResponseEntity<List<ProductResponse>> {
        val products = productService.getActiveProducts(category, query)
        return ResponseEntity.ok(products)
    }

    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<ProductResponse> {
        val product = productService.getProductById(id)
        return ResponseEntity.ok(product)
    }

    @PostMapping
    fun createProduct(
        @AuthenticationPrincipal principal: StudentPrincipal,
        @Valid @RequestBody request: ProductRequest
    ): ResponseEntity<ProductResponse> {
        val created = productService.createProduct(principal.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @PutMapping("/{id}")
    fun updateProduct(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: StudentPrincipal,
        @Valid @RequestBody request: ProductRequest
    ): ResponseEntity<ProductResponse> {
        val updated = productService.updateProduct(id, principal.id, request)
        return ResponseEntity.ok(updated)
    }

    @DeleteMapping("/{id}")
    fun deleteProduct(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: StudentPrincipal
    ): ResponseEntity<Map<String, String>> {
        productService.deleteProduct(id, principal.id)
        return ResponseEntity.ok(mapOf("message" to "Product successfully deleted"))
    }

    @PatchMapping("/{id}/sold")
    fun markAsSold(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: StudentPrincipal
    ): ResponseEntity<ProductResponse> {
        val updated = productService.markAsSold(id, principal.id)
        return ResponseEntity.ok(updated)
    }

    @GetMapping("/my-listings")
    fun getMyListings(
        @AuthenticationPrincipal principal: StudentPrincipal,
        @RequestParam(required = false) status: ProductStatus?
    ): ResponseEntity<List<ProductResponse>> {
        val listings = productService.getStudentListings(principal.id, status)
        return ResponseEntity.ok(listings)
    }
}

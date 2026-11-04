package com.campx.dto

import com.campx.model.ProductCondition
import com.campx.model.ProductStatus
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal
import java.time.LocalDateTime

data class ProductRequest(
    @field:NotBlank(message = "Product name is required")
    val productName: String,

    @field:NotBlank(message = "Description is required")
    val description: String,

    @field:NotBlank(message = "Category is required")
    val category: String,

    @field:NotNull(message = "Price is required")
    @field:DecimalMin(value = "0.01", message = "Price must be a valid positive amount")
    val price: BigDecimal,

    @field:NotNull(message = "Condition is required")
    val condition: ProductCondition,

    val imageUrl: String? = null,

    @field:NotBlank(message = "Location or preferred meeting point is required")
    val location: String
)

data class ProductResponse(
    val id: Long,
    val productName: String,
    val description: String,
    val category: String,
    val price: BigDecimal,
    val condition: ProductCondition,
    val imageUrl: String?,
    val location: String,
    val status: ProductStatus,
    val seller: SellerSummaryDto,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class SellerSummaryDto(
    val id: Long,
    val name: String,
    val collegeEmail: String,
    val phoneNumber: String
)

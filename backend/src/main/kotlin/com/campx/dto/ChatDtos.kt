package com.campx.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

data class StartConversationRequest(
    @field:NotNull(message = "Product ID is required")
    val productId: Long,

    @field:NotBlank(message = "Initial message content is required")
    val initialMessage: String
)

data class SendMessageRequest(
    @field:NotBlank(message = "Message content is required")
    val content: String
)

data class ConversationResponse(
    val id: Long,
    val productId: Long,
    val productName: String,
    val productPrice: java.math.BigDecimal,
    val productImageUrl: String?,
    val buyer: SellerSummaryDto,
    val seller: SellerSummaryDto,
    val lastMessage: String?,
    val lastMessageTime: LocalDateTime?,
    val updatedAt: LocalDateTime
)

data class MessageResponse(
    val id: Long,
    val conversationId: Long,
    val senderId: Long,
    val senderName: String,
    val content: String,
    val timestamp: LocalDateTime
)

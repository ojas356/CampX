package com.campx.service

import com.campx.dto.ConversationResponse
import com.campx.dto.MessageResponse
import com.campx.dto.SellerSummaryDto
import com.campx.dto.SendMessageRequest
import com.campx.dto.StartConversationRequest
import com.campx.model.Conversation
import com.campx.model.Message
import com.campx.repository.ConversationRepository
import com.campx.repository.MessageRepository
import com.campx.repository.ProductRepository
import com.campx.repository.StudentRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class ChatService(
    private val conversationRepository: ConversationRepository,
    private val messageRepository: MessageRepository,
    private val productRepository: ProductRepository,
    private val studentRepository: StudentRepository
) {

    @Transactional
    fun startOrGetConversation(buyerId: Long, request: StartConversationRequest): ConversationResponse {
        val product = productRepository.findById(request.productId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found") }

        val buyer = studentRepository.findById(buyerId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer student not found") }

        val seller = product.student

        // Prevent chatting with oneself
        if (seller.id == buyerId) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "You cannot start a chat conversation for your own product."
            )
        }

        // Check if conversation already exists for this product and buyer
        val conversation = conversationRepository.findByProductIdAndBuyerId(product.id!!, buyerId)
            .orElseGet {
                val newConv = Conversation(
                    product = product,
                    buyer = buyer,
                    seller = seller
                )
                conversationRepository.save(newConv)
            }

        // Save initial message if provided
        if (request.initialMessage.isNotBlank()) {
            val message = Message(
                conversation = conversation,
                sender = buyer,
                content = request.initialMessage.trim()
            )
            messageRepository.save(message)
            conversation.updatedAt = LocalDateTime.now()
            conversationRepository.save(conversation)
        }

        return toConversationResponse(conversation)
    }

    fun getStudentConversations(studentId: Long): List<ConversationResponse> {
        val conversations = conversationRepository.findByStudentId(studentId)
        return conversations.map { toConversationResponse(it) }
    }

    fun getConversationMessages(conversationId: Long, studentId: Long): List<MessageResponse> {
        val conversation = conversationRepository.findById(conversationId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found") }

        // Security check: only participants can view messages
        if (conversation.buyer.id != studentId && conversation.seller.id != studentId) {
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Access denied: You are not a participant in this conversation."
            )
        }

        val messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId)
        return messages.map {
            MessageResponse(
                id = it.id!!,
                conversationId = conversation.id!!,
                senderId = it.sender.id!!,
                senderName = it.sender.name,
                content = it.content,
                timestamp = it.timestamp
            )
        }
    }

    @Transactional
    fun sendMessage(conversationId: Long, senderId: Long, request: SendMessageRequest): MessageResponse {
        val conversation = conversationRepository.findById(conversationId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found") }

        // Security check: only participants can send messages
        if (conversation.buyer.id != senderId && conversation.seller.id != senderId) {
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Access denied: You are not a participant in this conversation."
            )
        }

        val sender = studentRepository.findById(senderId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found") }

        val message = Message(
            conversation = conversation,
            sender = sender,
            content = request.content.trim()
        )

        val savedMessage = messageRepository.save(message)

        conversation.updatedAt = LocalDateTime.now()
        conversationRepository.save(conversation)

        return MessageResponse(
            id = savedMessage.id!!,
            conversationId = conversation.id!!,
            senderId = sender.id!!,
            senderName = sender.name,
            content = savedMessage.content,
            timestamp = savedMessage.timestamp
        )
    }

    private fun toConversationResponse(conv: Conversation): ConversationResponse {
        val messages = messageRepository.findByConversationIdOrderByTimestampAsc(conv.id!!)
        val lastMsg = messages.lastOrNull()

        return ConversationResponse(
            id = conv.id,
            productId = conv.product.id!!,
            productName = conv.product.productName,
            productPrice = conv.product.price,
            productImageUrl = conv.product.imageUrl,
            buyer = SellerSummaryDto(
                id = conv.buyer.id!!,
                name = conv.buyer.name,
                collegeEmail = conv.buyer.collegeEmail,
                phoneNumber = conv.buyer.phoneNumber
            ),
            seller = SellerSummaryDto(
                id = conv.seller.id!!,
                name = conv.seller.name,
                collegeEmail = conv.seller.collegeEmail,
                phoneNumber = conv.seller.phoneNumber
            ),
            lastMessage = lastMsg?.content,
            lastMessageTime = lastMsg?.timestamp,
            updatedAt = conv.updatedAt
        )
    }
}

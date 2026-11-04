package com.campx.repository

import com.campx.model.Message
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository : JpaRepository<Message, Long> {
    fun findByConversationIdOrderByTimestampAsc(conversationId: Long): List<Message>
}

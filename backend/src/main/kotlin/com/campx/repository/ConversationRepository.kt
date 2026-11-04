package com.campx.repository

import com.campx.model.Conversation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface ConversationRepository : JpaRepository<Conversation, Long> {
    @Query(
        """
        SELECT c FROM Conversation c
        WHERE c.buyer.id = :studentId OR c.seller.id = :studentId
        ORDER BY c.updatedAt DESC
        """
    )
    fun findByStudentId(studentId: Long): List<Conversation>

    fun findByProductIdAndBuyerId(productId: Long, buyerId: Long): Optional<Conversation>
}

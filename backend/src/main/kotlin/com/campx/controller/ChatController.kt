package com.campx.controller

import com.campx.dto.*
import com.campx.security.StudentPrincipal
import com.campx.service.ChatService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/chat")
class ChatController(
    private val chatService: ChatService
) {

    @PostMapping("/start")
    fun startOrGetConversation(
        @AuthenticationPrincipal principal: StudentPrincipal,
        @Valid @RequestBody request: StartConversationRequest
    ): ResponseEntity<ConversationResponse> {
        val conversation = chatService.startOrGetConversation(principal.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(conversation)
    }

    @GetMapping("/conversations")
    fun getConversations(
        @AuthenticationPrincipal principal: StudentPrincipal
    ): ResponseEntity<List<ConversationResponse>> {
        val conversations = chatService.getStudentConversations(principal.id)
        return ResponseEntity.ok(conversations)
    }

    @GetMapping("/conversations/{id}/messages")
    fun getMessages(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: StudentPrincipal
    ): ResponseEntity<List<MessageResponse>> {
        val messages = chatService.getConversationMessages(id, principal.id)
        return ResponseEntity.ok(messages)
    }

    @PostMapping("/conversations/{id}/messages")
    fun sendMessage(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: StudentPrincipal,
        @Valid @RequestBody request: SendMessageRequest
    ): ResponseEntity<MessageResponse> {
        val message = chatService.sendMessage(id, principal.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(message)
    }
}

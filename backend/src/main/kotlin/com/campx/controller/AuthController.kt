package com.campx.controller

import com.campx.dto.*
import com.campx.security.StudentPrincipal
import com.campx.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        val response = authService.register(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<Map<String, String>> {
        // Stateless JWT logout is handled on client by clearing the stored token
        return ResponseEntity.ok(mapOf("message" to "Successfully logged out"))
    }

    @GetMapping("/me")
    fun getCurrentStudent(@AuthenticationPrincipal principal: StudentPrincipal): ResponseEntity<StudentProfileDto> {
        val profile = authService.getProfile(principal.id)
        return ResponseEntity.ok(profile)
    }

    @PutMapping("/profile")
    fun updateProfile(
        @AuthenticationPrincipal principal: StudentPrincipal,
        @Valid @RequestBody request: UpdateProfileRequest
    ): ResponseEntity<StudentProfileDto> {
        val updated = authService.updateProfile(principal.id, request)
        return ResponseEntity.ok(updated)
    }
}

package com.campx.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class RegisterRequest(
    @field:NotBlank(message = "Student name is required")
    val name: String,

    @field:NotBlank(message = "College email is required")
    @field:Email(message = "Invalid email format")
    val collegeEmail: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String,

    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^(\\+91)?[6-9]\\d{9}$", message = "Valid Indian mobile number is required")
    val phoneNumber: String
)

data class LoginRequest(
    @field:NotBlank(message = "College email is required")
    val collegeEmail: String,

    @field:NotBlank(message = "Password is required")
    val password: String
)

data class AuthResponse(
    val token: String,
    val student: StudentProfileDto
)

data class StudentProfileDto(
    val id: Long,
    val name: String,
    val collegeEmail: String,
    val phoneNumber: String,
    val createdAt: LocalDateTime
)

data class UpdateProfileRequest(
    @field:NotBlank(message = "Name is required")
    val name: String,

    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^(\\+91)?[6-9]\\d{9}$", message = "Valid Indian mobile number is required")
    val phoneNumber: String
)

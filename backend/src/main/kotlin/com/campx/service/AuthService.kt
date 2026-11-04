package com.campx.service

import com.campx.dto.*
import com.campx.model.Student
import com.campx.repository.StudentRepository
import com.campx.security.JwtTokenProvider
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class AuthService(
    private val studentRepository: StudentRepository,
    private val passwordEncoder: PasswordEncoder,
    private val tokenProvider: JwtTokenProvider
) {
    companion object {
        const val REQUIRED_DOMAIN = "@apsit.edu.in"
    }

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        val email = request.collegeEmail.trim().lowercase()

        // 1. Strict college email domain validation
        if (!email.endsWith(REQUIRED_DOMAIN) || !email.matches(Regex("^[a-zA-Z0-9._%+-]+@apsit\\.edu\\.in$"))) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Registration is strictly restricted to A.P. Shah Institute of Technology emails ending with $REQUIRED_DOMAIN"
            )
        }

        // 2. Uniqueness check
        if (studentRepository.existsByCollegeEmail(email)) {
            throw ResponseStatusException(
                HttpStatus.CONFLICT,
                "An account with email $email already exists."
            )
        }

        // 3. Securely hash password using BCrypt
        val hashedPassword = passwordEncoder.encode(request.password)

        val newStudent = Student(
            name = request.name.trim(),
            collegeEmail = email,
            passwordHash = hashedPassword,
            phoneNumber = request.phoneNumber.trim()
        )

        val savedStudent = studentRepository.save(newStudent)
        val token = tokenProvider.generateToken(savedStudent.id!!, savedStudent.collegeEmail)

        return AuthResponse(
            token = token,
            student = toProfileDto(savedStudent)
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val email = request.collegeEmail.trim().lowercase()

        val student = studentRepository.findByCollegeEmail(email)
            .orElseThrow {
                ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.")
            }

        if (!passwordEncoder.matches(request.password, student.passwordHash)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.")
        }

        val token = tokenProvider.generateToken(student.id!!, student.collegeEmail)

        return AuthResponse(
            token = token,
            student = toProfileDto(student)
        )
    }

    fun getProfile(studentId: Long): StudentProfileDto {
        val student = studentRepository.findById(studentId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found") }
        return toProfileDto(student)
    }

    @Transactional
    fun updateProfile(studentId: Long, request: UpdateProfileRequest): StudentProfileDto {
        val student = studentRepository.findById(studentId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found") }

        student.name = request.name.trim()
        student.phoneNumber = request.phoneNumber.trim()

        val updated = studentRepository.save(student)
        return toProfileDto(updated)
    }

    private fun toProfileDto(student: Student) = StudentProfileDto(
        id = student.id!!,
        name = student.name,
        collegeEmail = student.collegeEmail,
        phoneNumber = student.phoneNumber,
        createdAt = student.createdAt
    )
}

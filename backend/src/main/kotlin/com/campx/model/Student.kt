package com.campx.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "students")
data class Student(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(name = "college_email", nullable = false, unique = true)
    var collegeEmail: String,

    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    var passwordHash: String,

    @Column(name = "phone_number", nullable = false)
    var phoneNumber: String,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    @OneToMany(mappedBy = "student", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonIgnore
    val products: MutableList<Product> = mutableListOf()
}

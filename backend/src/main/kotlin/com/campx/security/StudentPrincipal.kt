package com.campx.security

import com.campx.model.Student
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class StudentPrincipal(
    val student: Student
) : UserDetails {
    val id: Long = student.id ?: 0L
    val collegeEmail: String = student.collegeEmail

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority("ROLE_STUDENT"))
    }

    override fun getPassword(): String = student.passwordHash
    override fun getUsername(): String = student.collegeEmail
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
}

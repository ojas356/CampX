package com.campx.repository

import com.campx.model.Student
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface StudentRepository : JpaRepository<Student, Long> {
    fun findByCollegeEmail(collegeEmail: String): Optional<Student>
    fun existsByCollegeEmail(collegeEmail: String): Boolean
}

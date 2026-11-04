package com.campx.config

import com.campx.model.*
import com.campx.repository.ConversationRepository
import com.campx.repository.MessageRepository
import com.campx.repository.ProductRepository
import com.campx.repository.StudentRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.math.BigDecimal

@Component
class DataInitializer(
    private val studentRepository: StudentRepository,
    private val productRepository: ProductRepository,
    private val conversationRepository: ConversationRepository,
    private val messageRepository: MessageRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (studentRepository.count() > 0) return

        // Create Seed APSIT Students
        val arav = studentRepository.save(
            Student(
                name = "Arav Patel",
                collegeEmail = "arav.patel@apsit.edu.in",
                passwordHash = passwordEncoder.encode("Password@123"),
                phoneNumber = "+919820112233"
            )
        )

        val neha = studentRepository.save(
            Student(
                name = "Neha Sharma",
                collegeEmail = "neha.sharma@apsit.edu.in",
                passwordHash = passwordEncoder.encode("Password@123"),
                phoneNumber = "+919876543210"
            )
        )

        val rohit = studentRepository.save(
            Student(
                name = "Rohit Verma",
                collegeEmail = "rohit.verma@apsit.edu.in",
                passwordHash = passwordEncoder.encode("Password@123"),
                phoneNumber = "+919765432109"
            )
        )

        // Seed Products for APSIT Students
        val calc = productRepository.save(
            Product(
                productName = "Casio fx-991EX ClassWiz Scientific Calculator",
                description = "Mint condition, used for only two semesters in FE/SE engineering. Original protective sliding case included. Genuine solar + battery powered.",
                category = "Electronics",
                price = BigDecimal("850.00"),
                condition = ProductCondition.SECOND_HAND,
                imageUrl = "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
                location = "APSIT Main Canteen or 3rd Floor IT Lab",
                status = ProductStatus.ACTIVE,
                student = arav
            )
        )

        val drafter = productRepository.save(
            Product(
                productName = "Omega Mini Drafter & Engineering Drawing Sheet Holder",
                description = "Complete Engineering Graphics & Design set. Includes steel clamp mini drafter with scales, sheet container tube, and set squares. No cracks or bends.",
                category = "Engineering Tools",
                price = BigDecimal("450.00"),
                condition = ProductCondition.SECOND_HAND,
                imageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                location = "Mechanical Workshop or Ground Floor Foyer",
                status = ProductStatus.ACTIVE,
                student = arav
            )
        )

        val book = productRepository.save(
            Product(
                productName = "Applied Mathematics Vol. 3 (Dr. G.V. Kumbhojkar)",
                description = "Clean copy with pencil annotations only on formula summaries. Essential for Semester 3 Computer & IT students. Saves you buying brand new at full price.",
                category = "Books & Notes",
                price = BigDecimal("350.00"),
                condition = ProductCondition.SECOND_HAND,
                imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
                location = "Central Library Reading Room or Gate 1",
                status = ProductStatus.ACTIVE,
                student = neha
            )
        )

        val labCoat = productRepository.save(
            Product(
                productName = "Brand New White Lab Coat (Size L, 40)",
                description = "Unused 100% cotton lab coat required for Chemistry Lab and Workshop practices. Bought wrong size, tags still intact.",
                category = "Lab Coats & Kits",
                price = BigDecimal("300.00"),
                condition = ProductCondition.NEW,
                imageUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                location = "Chemistry Lab 1st Floor or Girls Common Room",
                status = ProductStatus.ACTIVE,
                student = neha
            )
        )

        val arduino = productRepository.save(
            Product(
                productName = "Arduino Uno R3 Starter Kit with Sensor Modules",
                description = "Perfect for Mini-Projects and IoT lab work. Comes with Breadboard, jumper wires, ultrasonic sensor, DHT11, and servo motor.",
                category = "Electronics",
                price = BigDecimal("950.00"),
                condition = ProductCondition.SECOND_HAND,
                imageUrl = "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
                location = "EXTC Embedded Lab or Main Gate",
                status = ProductStatus.ACTIVE,
                student = rohit
            )
        )

        // Seed initial conversation between Neha and Arav for the Calculator
        val conv = conversationRepository.save(
            Conversation(
                product = calc,
                buyer = neha,
                seller = arav
            )
        )

        messageRepository.save(
            Message(
                conversation = conv,
                sender = neha,
                content = "Hey Arav! Is the Casio calculator still available? Can we meet around 1:15 PM near the canteen?"
            )
        )

        messageRepository.save(
            Message(
                conversation = conv,
                sender = arav,
                content = "Hi Neha! Yes it's available. 1:15 PM at the canteen tables works great for me. See you then!"
            )
        )
    }
}

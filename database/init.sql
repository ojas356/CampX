-- =====================================================================
-- CampX — A.P. Shah Institute of Technology (APSIT) Student Marketplace
-- Database Initialization & Schema Definition (PostgreSQL)
-- =====================================================================

-- 1. Create Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    college_email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_apsit_email CHECK (college_email LIKE '%@apsit.edu.in')
);

-- Index for fast lookup on college email during authentication
CREATE INDEX IF NOT EXISTS idx_students_college_email ON students(college_email);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('NEW', 'SECOND_HAND')),
    image_url TEXT,
    location VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'SOLD')),
    student_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_products_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE
);

-- Indexes for product browsing and filtering
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_student_id ON products(student_id);

-- 3. Create Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_conversations_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversations_buyer FOREIGN KEY (buyer_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversations_seller FOREIGN KEY (seller_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uq_product_buyer UNIQUE (product_id, buyer_id),
    CONSTRAINT chk_no_self_chat CHECK (buyer_id <> seller_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller ON conversations(seller_id);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) 
        REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) 
        REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

-- =====================================================================
-- Seed Initial Demo Data (Password: Password@123 with BCrypt hash)
-- =====================================================================
INSERT INTO students (id, name, college_email, password_hash, phone_number, created_at)
VALUES 
(1, 'Arav Patel', 'arav.patel@apsit.edu.in', '$2a$10$wK1bQvV82eGfD04uR.K5e.zTsh2gQJjGffO3cskk8W4gXj4sV/04q', '+919820112233', CURRENT_TIMESTAMP),
(2, 'Neha Sharma', 'neha.sharma@apsit.edu.in', '$2a$10$wK1bQvV82eGfD04uR.K5e.zTsh2gQJjGffO3cskk8W4gXj4sV/04q', '+919876543210', CURRENT_TIMESTAMP),
(3, 'Rohit Verma', 'rohit.verma@apsit.edu.in', '$2a$10$wK1bQvV82eGfD04uR.K5e.zTsh2gQJjGffO3cskk8W4gXj4sV/04q', '+919765432109', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, product_name, description, category, price, condition, image_url, location, status, student_id)
VALUES 
(1, 'Casio fx-991EX ClassWiz Scientific Calculator', 'Mint condition, used for two semesters in FE/SE. Solar + battery powered with sliding case.', 'Electronics', 850.00, 'SECOND_HAND', 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80', 'APSIT Main Canteen or 3rd Floor IT Lab', 'ACTIVE', 1),
(2, 'Omega Mini Drafter & Sheet Holder Tube', 'Complete Engineering Drawing kit with mini drafter, scale, sheet holder tube, clips.', 'Engineering Tools', 450.00, 'SECOND_HAND', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'Mechanical Workshop or Ground Floor Foyer', 'ACTIVE', 1),
(3, 'Applied Mathematics Vol. 3 (Dr. G.V. Kumbhojkar)', 'Essential for Sem 3 Computer & IT students. Clean pages with pencil formulas.', 'Books & Notes', 350.00, 'SECOND_HAND', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 'Central Library Reading Room or Gate 1', 'ACTIVE', 2),
(4, 'Brand New White Lab Coat (Size L, 40)', 'Unused 100% cotton lab coat for Chemistry Lab and Workshop practices. With tags.', 'Lab Coats & Kits', 300.00, 'NEW', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'Chemistry Lab 1st Floor or Girls Common Room', 'ACTIVE', 2),
(5, 'Arduino Uno R3 Starter Kit with Sensor Modules', 'Includes Breadboard, jumper wires, ultrasonic sensor, DHT11, and servo motor.', 'Electronics', 950.00, 'SECOND_HAND', 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80', 'EXTC Embedded Lab or Main Gate', 'ACTIVE', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO conversations (id, product_id, buyer_id, seller_id)
VALUES (1, 1, 2, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, timestamp)
VALUES 
(1, 1, 2, 'Hey Arav! Is the Casio calculator still available? Can we meet around 1:15 PM near the canteen?', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(2, 1, 1, 'Hi Neha! Yes it is available. 1:15 PM at the canteen tables works great for me. See you then!', CURRENT_TIMESTAMP - INTERVAL '50 minutes')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence IDs
SELECT setval('students_id_seq', (SELECT MAX(id) FROM students));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('conversations_id_seq', (SELECT MAX(id) FROM conversations));
SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages));

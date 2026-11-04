-- =====================================================================
-- CampX — Database Inspection Queries for Students and Products
-- Note: Sensitive fields (password_hash) are strictly omitted.
-- =====================================================================

-- 1. View all registered APSIT students (omitting password hashes)
SELECT 
    id, 
    name, 
    college_email, 
    phone_number, 
    created_at 
FROM students
ORDER BY id ASC;

-- 2. View all active products currently listed on the marketplace
SELECT 
    id, 
    product_name, 
    category, 
    price, 
    condition, 
    location, 
    status, 
    created_at
FROM products
WHERE status = 'ACTIVE'
ORDER BY created_at DESC;

-- 3. View products listed by a specific student (e.g. Student ID = 1, Arav Patel)
SELECT 
    p.id, 
    p.product_name, 
    p.category, 
    p.price, 
    p.condition, 
    p.status, 
    p.location
FROM products p
WHERE p.student_id = 1
ORDER BY p.created_at DESC;

-- 4. JOIN query: View student details alongside their listed products (Demonstrates Foreign Key relationship)
SELECT 
    s.id AS student_id,
    s.name AS student_name,
    s.college_email,
    s.phone_number,
    p.id AS product_id,
    p.product_name,
    p.category,
    p.price,
    p.condition,
    p.status AS listing_status,
    p.location AS campus_meeting_point
FROM students s
INNER JOIN products p ON s.id = p.student_id
ORDER BY s.id ASC, p.created_at DESC;

-- 5. Count of active listings per student
SELECT 
    s.name AS student_name,
    s.college_email,
    COUNT(p.id) AS total_products_listed,
    SUM(CASE WHEN p.status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_products,
    SUM(CASE WHEN p.status = 'SOLD' THEN 1 ELSE 0 END) AS sold_products
FROM students s
LEFT JOIN products p ON s.id = p.student_id
GROUP BY s.id, s.name, s.college_email
ORDER BY total_products_listed DESC;

-- 6. Inspect chat conversations and message counts
SELECT 
    c.id AS conversation_id,
    p.product_name,
    b.name AS buyer_name,
    s.name AS seller_name,
    COUNT(m.id) AS total_messages,
    c.updated_at
FROM conversations c
JOIN products p ON c.product_id = p.id
JOIN students b ON c.buyer_id = b.id
JOIN students s ON c.seller_id = s.id
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY c.id, p.product_name, b.name, s.name, c.updated_at
ORDER BY c.updated_at DESC;

# CampX — Full-Stack Student Marketplace for APSIT

**CampX** is an exclusive, peer-to-peer campus marketplace designed specifically for students of **A.P. Shah Institute of Technology (APSIT)**. It allows verified students to buy, sell, and exchange engineering equipment (scientific calculators, mini drafters, sheet containers), textbooks, lab coats, and electronic kits safely within the campus community.

---

## 1. Project Folder Structure

The project maintains a strict separation of concerns across frontend, backend, and database:

```
CampX/
├── frontend/                     # React Frontend (JavaScript, Vite, React Router)
│   ├── package.json
│   ├── vite.config.js            # Proxies /api calls to backend (port 8080)
│   ├── index.html
│   └── src/
│       ├── main.jsx              # Application entry point
│       ├── App.jsx               # React Router routes setup
│       ├── index.css             # Tailwind CSS styles
│       ├── components/           # Reusable UI components
│       │   ├── Navbar.jsx        # Navigation, student switcher, search
│       │   ├── ProductCard.jsx   # Marketplace item card
│       │   ├── ProductModal.jsx  # Detailed popup with seller contacts & chat button
│       │   └── Footer.jsx        # Campus safety tips & info
│       ├── pages/                # Screen views
│       │   ├── HomePage.jsx      # Campus hero banner, categories, recent items
│       │   ├── BrowsePage.jsx    # Search, category, condition & price filters
│       │   ├── SellPage.jsx      # Add product form with image upload & preview
│       │   ├── MyListingsPage.jsx# Student dashboard (Edit, Mark Sold, Delete)
│       │   ├── MessagesPage.jsx  # Student-to-student in-app chat
│       │   ├── ProfilePage.jsx   # Student profile view and edit
│       │   ├── LoginPage.jsx     # Student login with test accounts
│       │   └── RegisterPage.jsx  # Registration enforcing @apsit.edu.in domain
│       ├── context/
│       │   └── AuthContext.jsx   # Authentication state management
│       ├── services/
│       │   └── api.js            # Fetch API client matching backend REST endpoints
│       └── utils/
│           └── validators.js     # Domain validation & ownership rules
│
├── backend/                      # Kotlin Spring Boot Application
│   ├── build.gradle.kts          # Gradle build file with Kotlin DSL
│   ├── settings.gradle.kts
│   └── src/
│       ├── main/
│       │   ├── resources/
│       │   │   └── application.properties # DB connection & JWT settings
│       │   └── kotlin/com/campx/
│       │       ├── CampxApplication.kt    # Spring Boot main class
│       │       ├── model/                 # JPA Entities
│       │       │   ├── Student.kt         # Student entity (id, email, passwordHash)
│       │       │   ├── Product.kt         # Product entity (Foreign key: student_id)
│       │       │   ├── Conversation.kt    # Conversation entity
│       │       │   └── Message.kt         # Message entity
│       │       ├── repository/            # Spring Data JPA Repositories
│       │       │   ├── StudentRepository.kt
│       │       │   ├── ProductRepository.kt
│       │       │   ├── ConversationRepository.kt
│       │       │   └── MessageRepository.kt
│       │       ├── dto/                   # Platform-independent DTOs
│       │       │   ├── AuthDtos.kt
│       │       │   ├── ProductDtos.kt
│       │       │   └── ChatDtos.kt
│       │       ├── security/              # Spring Security & JWT configuration
│       │       │   ├── SecurityConfig.kt
│       │       │   ├── JwtTokenProvider.kt
│       │       │   ├── JwtAuthenticationFilter.kt
│       │       │   └── StudentPrincipal.kt
│       │       ├── service/               # Business logic & security rules
│       │       │   ├── AuthService.kt     # Strict @apsit.edu.in validation
│       │       │   ├── ProductService.kt  # Enforces product ownership
│       │       │   └── ChatService.kt     # Enforces participant access & prevents self-chat
│       │       ├── controller/            # REST API Controllers
│       │       │   ├── AuthController.kt
│       │       │   ├── ProductController.kt
│       │       │   └── ChatController.kt
│       │       └── config/
│       │           └── DataInitializer.kt # Seeds sample APSIT accounts & listings
│
├── database/                     # Database setup and inspection (Windows No-Docker + CLI)
│   ├── setup-windows.ps1         # 1-command Windows PowerShell PostgreSQL setup (no Docker/pgAdmin)
│   ├── start-db-windows.bat      # Start local PostgreSQL server on Windows
│   ├── stop-db-windows.bat       # Stop local PostgreSQL server on Windows (0 background RAM)
│   ├── inspect-db-windows.bat    # Inspect tables & run SQL queries in Windows CMD/PowerShell
│   ├── init.sql                  # PostgreSQL DDL schema & sample records
│   ├── inspect_queries.sql       # Sample SQL queries for demonstrating relationships
│   ├── docker-compose.yml        # Optional container config if Docker is used later
│   └── README.md                 # Detailed Windows non-Docker PostgreSQL guide
│
├── README.md                     # Complete project documentation
└── .gitignore
```

---

## 2. Technology Stack & Design Decisions

### Frontend
- **React 19** with **pure JavaScript** (`.js`, `.jsx`). No TypeScript is used in the frontend codebase.
- **Vite** for fast builds and hot module reloading.
- **React Router** for clean client-side routing.
- **Tailwind CSS** for responsive layout and styling.
- **Fetch API** with centralized error handling and Bearer token headers in `services/api.js`.

### Backend
- **Kotlin** with **Spring Boot 3.3.x**.
- **Spring Web** for RESTful API endpoints.
- **Spring Data JPA** for ORM and PostgreSQL interactions.
- **Spring Security** with **BCrypt** password hashing and stateless **JWT** (JSON Web Tokens).
- **Gradle** with **Kotlin DSL** (`build.gradle.kts`).

### Database
- **PostgreSQL 16 (Windows Native / Portable CLI — No Docker & No pgAdmin Required)**: Runs directly on Windows using a lightweight local `pgdata` folder (~100 MB instead of 1 GB+), controlled by simple `.bat` scripts so it consumes zero background RAM when stopped.
- Environment variable configuration for sensitive credentials.

---

## 3. How to Run the Application on Windows (Without Docker)

### Step 1: Start PostgreSQL Database on Windows (No Docker, No pgAdmin)

Open **PowerShell** in the `database` folder and run the automated setup script:

```powershell
cd database
powershell -ExecutionPolicy Bypass -File .\setup-windows.ps1
```

**What this does automatically:**
1. Checks if PostgreSQL CLI tools (`pg_ctl`, `initdb`, `psql`) are installed; if not, installs portable CLI-only PostgreSQL via Scoop (skipping heavy pgAdmin and StackBuilder).
2. Initializes a local database folder at `database\pgdata`.
3. Starts PostgreSQL on `localhost:5432`.
4. Creates user `campx_user` (`campx_pass`), creates database `campx_db`, and loads the schema + APSIT sample data from `init.sql`.

**Daily Windows Commands (inside `database\`):**
- **Start PostgreSQL:** `.\start-db-windows.bat`
- **Inspect Tables & Data (CLI):** `.\inspect-db-windows.bat`
- **Stop PostgreSQL (0 background RAM):** `.\stop-db-windows.bat`

---

### Step 2: Run the Kotlin Spring Boot Backend

#### Prerequisites:
- Java JDK 17 or higher
- (Optional) Gradle, or use the bundled Gradle wrapper

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure your environment variables in PowerShell (optional, defaults in `application.properties` already match `localhost:5432`):
   ```powershell
   $env:DB_HOST="localhost"
   $env:DB_PORT="5432"
   $env:DB_NAME="campx_db"
   $env:DB_USERNAME="campx_user"
   $env:DB_PASSWORD="campx_pass"
   $env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
   ```
3. Build and run the Spring Boot application:
   ```powershell
   gradle bootRun
   ```
   *The backend will start on `http://localhost:8080`.*

---

### Step 3: Run the React Frontend

1. Open a new terminal in the `frontend/` directory (or root):
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 4. Test Student Accounts (Pre-Seeded)

The database includes three realistic pre-seeded APSIT student accounts for testing:

| Student Name | College Email | Password | Phone Number |
|---|---|---|---|
| **Arav Patel** | `arav.patel@apsit.edu.in` | `Password@123` | `+919820112233` |
| **Neha Sharma** | `neha.sharma@apsit.edu.in` | `Password@123` | `+919876543210` |
| **Rohit Verma** | `rohit.verma@apsit.edu.in` | `Password@123` | `+919765432109` |

> **Pro Tip in UI:** The navigation bar includes a one-click student switcher in the top banner so you can switch between Arav (seller) and Neha (buyer) to test real-time chat interactions without having to repeatedly log in and out.

---

## 5. Security & Ownership Rules

### Strict College Email Domain Check
- Registration is strictly guarded: emails must match the regex `^[a-zA-Z0-9._%+-]+@apsit\.edu\.in$`.
- Attempting to register with `@gmail.com`, `@yahoo.com`, or spoofed domains like `@apsit.edu.in.phishing.com` is rejected immediately with HTTP 400 Bad Request.
- *Note:* While domain validation ensures only APSIT email formats can register, full identity verification in production requires a one-time email confirmation link / OTP.

### Backend-Enforced Product Ownership
- When a student creates a listing, the backend automatically extracts the authenticated student ID from the JWT token and binds them as the seller.
- Any attempt to edit (`PUT /api/products/{id}`), delete (`DELETE /api/products/{id}`), or mark as sold (`PATCH /api/products/{id}/sold`) checks that the `product.student.id == currentStudent.id`. If a malicious client attempts to modify another student's item, the backend aborts with **HTTP 403 Forbidden**.

### Chat Privacy & Self-Chat Prevention
- A student cannot start a chat conversation for their own product (`buyer.id != seller.id`).
- Conversation threads are only readable by the buyer and seller. Unauthorized access returns **HTTP 403 Forbidden**.

---

## 6. Database Inspection on Windows (Without Docker or pgAdmin)

You can inspect the database and demonstrate that registered students and their listings are stored correctly using the included Windows batch script or `psql` in PowerShell.

### Running Inspection on Windows
```powershell
cd database
.\inspect-db-windows.bat
```
Or connect directly via PowerShell:
```powershell
$env:PGPASSWORD="campx_pass"
psql -h localhost -p 5432 -U campx_user -d campx_db
```

### Key Demonstration Queries

#### 1. View all registered students (passwords omitted)
```sql
SELECT id, name, college_email, phone_number, created_at 
FROM students 
ORDER BY id ASC;
```

#### 2. Join students and products to verify ownership relationships
```sql
SELECT 
    s.id AS student_id,
    s.name AS student_name,
    s.college_email,
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
```

#### 3. View chat conversations and message counts
```sql
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
GROUP BY c.id, p.product_name, b.name, s.name, c.updated_at;
```

---

## 7. REST API Documentation (Flutter Compatible)

The REST API is designed to be completely platform-independent, allowing a future **Flutter/Dart mobile app** to consume the exact same endpoints.

### Authentication Endpoints
- `POST /api/auth/register` — Register a student with `@apsit.edu.in` email. Returns JWT token and student profile.
- `POST /api/auth/login` — Login with email and password. Returns JWT token.
- `POST /api/auth/logout` — Logout (stateless client cleanup).
- `GET /api/auth/me` — Fetch currently authenticated student profile.
- `PUT /api/auth/profile` — Update student name and phone number.

### Product Endpoints
- `GET /api/products` — Get all active products. Supports optional query parameters: `?category=Electronics&query=calculator`.
- `GET /api/products/{id}` — Get single product details including seller contact info.
- `POST /api/products` — Create a new listing (Authenticated).
- `PUT /api/products/{id}` — Update a product listing (Owner only).
- `DELETE /api/products/{id}` — Delete a product listing (Owner only).
- `PATCH /api/products/{id}/sold` — Mark an item as sold (Owner only).
- `GET /api/products/my-listings` — Get current student's listings (`?status=ACTIVE` or `?status=SOLD`).

### Chat Endpoints
- `POST /api/chat/start` — Start or retrieve a conversation for a product.
- `GET /api/chat/conversations` — Get all conversations for the authenticated student.
- `GET /api/chat/conversations/{id}/messages` — Get message history for a conversation (Participants only).
- `POST /api/chat/conversations/{id}/messages` — Send a message in a conversation.

---

## 8. Future Flutter/Dart Compatibility Roadmap

1. **State Management:** Use `flutter_bloc` or `Provider` to maintain authentication state and store the JWT in `flutter_secure_storage`.
2. **HTTP Service:** Use the `http` or `dio` package with an interceptor that automatically attaches `Authorization: Bearer <token>` to all protected routes.
3. **Screen Mirroring:** The Flutter app will mirror the React pages:
   - `HomeScreen` -> `HomePage.jsx`
   - `BrowseScreen` -> `BrowsePage.jsx`
   - `ProductDetailModal / Sheet` -> `ProductModal.jsx`
   - `SellScreen` -> `SellPage.jsx`
   - `ChatScreen` -> `MessagesPage.jsx`
4. **Backend Reusability:** The Kotlin Spring Boot API requires zero modifications to work with Flutter.

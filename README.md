# ShopFlow — Parallel Programming Project

A production-ready e-commerce backend built with Spring Boot, focused on **non-functional requirements** for high-concurrency systems: race condition protection, resource management, async processing, batch jobs, and load distribution.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Non-Functional Requirements](#non-functional-requirements)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)

---

## Prerequisites

Make sure the following are installed before building or running the project.

| Tool | Version | Purpose |
|------|---------|---------|
| Java JDK | 17+ | Compile and run the application |
| Maven | 3.9+ (or use `./mvnw`) | Build tool |
| Docker | 24+ | Run PostgreSQL, Redis, and the app |
| Docker Compose | 2.20+ | Orchestrate all services |

To verify:
```bash
java -version
./mvnw -version
docker -version
docker compose version
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.4.3 |
| Language | Java 17 |
| Database | PostgreSQL 16 |
| Cache / Token Store | Redis 7 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT |
| Auth Extras | OAuth2 (Google, GitHub), MFA (TOTP) |
| Async | Spring `@Async` + `ThreadPoolTaskExecutor` |
| Scheduling | Spring `@Scheduled` |
| Image Build | Google Jib (no Dockerfile needed) |
| Containerization | Docker + Docker Compose |

---

## Architecture

### Module Structure

The project follows a **modular, feature-based architecture**. Each feature is a self-contained module with its own layers — identical to how `auth` and `user` are structured.

```
src/main/java/.../
│
├── auth/                   # Authentication & Authorization
│   ├── controller/         # Login, Register, MFA, Session endpoints
│   ├── service/            # AuthenticationService, EmailService, JwtService
│   ├── security/           # JWT filter, UserPrincipal, OAuth2 handlers
│   ├── entity/             # RefreshToken, EmailVerificationToken, etc.
│   └── dto/                # Request/Response DTOs
│
├── user/                   # User profile management
│   ├── controller/
│   ├── entity/             # User, Role
│   └── repository/
│
├── product/                # Product catalog
│   ├── controller/         # GET /api/products, POST /api/products (admin)
│   ├── entity/             # Product (@Version for optimistic locking)
│   ├── service/
│   ├── strategy/           # PurchaseStrategy (Strategy Pattern)
│   │   ├── PurchaseStrategy.java          ← interface
│   │   ├── OptimisticPurchaseStrategy.java ← normal purchases
│   │   └── PessimisticPurchaseStrategy.java← flash sales
│   └── dto/
│
├── order/                  # Order management
│   ├── controller/         # POST /api/orders, POST /api/orders/flash-sale
│   ├── entity/             # Order, OrderItem
│   ├── event/              # OrderPlacedEvent + OrderEventListener (Observer Pattern)
│   ├── service/            # OrderService (uses PurchaseStrategy)
│   └── dto/
│
├── flashsale/              # Flash sale management
│   ├── controller/         # GET /api/flash-sales/{id}, POST (admin)
│   ├── entity/             # FlashSale (pessimistic lock target)
│   ├── repository/         # findByIdWithLock (@Lock PESSIMISTIC_WRITE)
│   └── service/
│
├── invoice/                # Invoice generation (async only, no controller)
│   ├── entity/             # Invoice
│   └── service/            # InvoiceService — called from background thread
│
├── report/                 # Background batch processing
│   ├── entity/             # DailySalesReport
│   ├── service/            # DailySalesReportService (chunk processing)
│   └── scheduler/          # DailySalesJob (@Scheduled, runs at midnight)
│
└── shared/                 # Cross-cutting concerns
    ├── config/             # SecurityConfig, AsyncConfig, CorsConfig
    ├── exception/          # GlobalExceptionHandler + custom exceptions
    ├── common/             # Auditable base entity (createdAt, updatedAt)
    └── dto/                # ApiResponse<T> wrapper
```

### Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Strategy** | `product/strategy/` | Swap between Optimistic and Pessimistic locking without changing `OrderService` |
| **Observer** | `order/event/` | Decouple invoice generation from the order HTTP request (Spring Events) |
| **Template Method** | `DailySalesReportService` | Batch chunk loop structure — same algorithm, pluggable data source |
| **Repository** | All modules | Data access abstraction via Spring Data JPA |

---

## Database Design

### Entity Relationship Diagram

```
┌──────────────────┐
│      users       │
│──────────────────│
│ id (UUID) PK     │
│ email            │
│ password         │
│ first_name       │
│ last_name        │
│ email_verified   │
│ mfa_enabled      │
│ auth_provider    │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1
         │
         │ N
┌────────▼─────────┐         ┌──────────────────────┐
│      orders      │         │       products        │
│──────────────────│         │──────────────────────│
│ id (UUID) PK     │         │ id (UUID) PK          │
│ user_id FK       │         │ name                  │
│ status           │         │ description           │
│ total_amount     │         │ price                 │
│ created_at       │         │ stock_quantity         │
│ updated_at       │         │ version  ◄────────────┼── @Version (Optimistic Lock)
└────────┬─────────┘         │ created_at            │
         │ 1                 │ updated_at            │
         │                   └──────────┬────────────┘
         │ N                            │ 1
┌────────▼─────────┐                   │
│   order_items    │                   │ N
│──────────────────│         ┌─────────▼────────────┐
│ id (UUID) PK     │         │      flash_sales      │
│ order_id FK      ├────────►│──────────────────────│
│ product_id FK    │         │ id (UUID) PK          │
│ quantity         │         │ product_id FK         │
│ unit_price       │         │ discounted_price      │
│ subtotal         │         │ total_quantity        │
└──────────────────┘         │ remaining_quantity ◄──┼── PESSIMISTIC_WRITE lock
                             │ start_time            │
┌──────────────────┐         │ end_time              │
│     invoices     │         │ active                │
│──────────────────│         └──────────────────────┘
│ id (UUID) PK     │
│ order_id FK      │         ┌──────────────────────┐
│ invoice_number   │         │  daily_sales_reports  │
│ status           │         │──────────────────────│
│ issued_at        │         │ id (UUID) PK          │
│ total_amount     │         │ report_date (unique)  │
└──────────────────┘         │ total_orders          │
                             │ total_revenue         │
                             │ processed_at          │
                             │ status                │
                             └──────────────────────┘
```

### Tables Summary

| Table | Key Detail |
|-------|-----------|
| `users` | Core user entity with MFA, OAuth2, and lock support |
| `products` | `version` column enables JPA Optimistic Locking |
| `flash_sales` | `remaining_quantity` is protected by Pessimistic (row-level) lock |
| `orders` | Links user to purchased items, status: PENDING / CONFIRMED / CANCELLED |
| `order_items` | Snapshot of price at purchase time (not live product price) |
| `invoices` | Generated asynchronously after order confirmation |
| `daily_sales_reports` | Populated nightly by batch job in chunks of 500 orders |

---

## Non-Functional Requirements

### 1. Race Condition Protection — Concurrent Data Integrity

Two strategies are implemented to demonstrate both approaches:

**Optimistic Locking** — used for normal purchases  
- JPA `@Version` column on `Product` entity
- Every `UPDATE` includes `WHERE version = ?` — if another thread already incremented it, the update affects 0 rows and `OptimisticLockException` is thrown
- The strategy retries up to 3 times before failing
- Best for: low-contention scenarios (typical shopping)

**Pessimistic Locking** — used for flash sales  
- `@Lock(LockModeType.PESSIMISTIC_WRITE)` on `FlashSaleRepository.findByIdWithLock()`
- Translates to `SELECT ... FOR UPDATE` in SQL — the DB row is exclusively locked until the transaction commits
- All other threads trying to read that row are blocked at the database level
- Best for: extreme contention (thousands of users racing for 10 items)

Files: `product/strategy/`, `flashsale/repository/FlashSaleRepository.java`

---

### 2. Resource Management — Thread Pool & Connection Pools

**Application Thread Pools** (`shared/config/AsyncConfig.java`):

```
orderExecutor  → corePoolSize=5, maxPoolSize=20, queueCapacity=100
batchExecutor  → corePoolSize=2, maxPoolSize=5,  queueCapacity=10
```

Both use `CallerRunsPolicy` — when the queue is full, the calling thread executes the task itself instead of dropping it (graceful degradation, no crash).

**HikariCP — PostgreSQL Connection Pool** (`application.yml`):
- `maximum-pool-size: 10` — max simultaneous DB queries
- `connection-timeout: 30000` — fail fast instead of hanging
- `max-lifetime: 1800000` — recycle connections before PostgreSQL closes them
- `leak-detection-threshold: 60000` — warn if a connection is held > 60s

**Lettuce — Redis Connection Pool** (`application.yml`):
- `max-active: 10` / `max-idle: 5` / `min-idle: 2`
- `max-wait: 2000ms` — wait up to 2 seconds for a free connection

---

### 3. Asynchronous Queues — Non-blocking Background Tasks

When an order is placed, the HTTP response is returned to the user immediately. Invoice generation runs in a **background thread** without blocking the request.

Flow:
```
POST /api/orders
      │
      ├─► Save order to DB
      ├─► Publish OrderPlacedEvent        ← happens synchronously (instant)
      └─► Return 201 to user              ← user gets response here

[Background — orderExecutor thread pool]
      └─► OrderEventListener.onOrderPlaced()
              └─► InvoiceService.generateInvoice()
                      └─► Save invoice to DB
```

Files: `order/event/OrderPlacedEvent.java`, `order/event/OrderEventListener.java`, `invoice/service/InvoiceService.java`

---

### 4. Batch Processing — Chunked Daily Sales Report

A background job runs every day at midnight UTC. It processes the previous day's confirmed orders in **chunks of 500** — never loading all rows into memory at once.

```
[00:00:00 UTC] DailySalesJob.runDailyReport()
      │
      └─► DailySalesReportService.generateReportForDate(yesterday)
              │
              ├─► Page 0: fetch orders 0–499   → accumulate totals
              ├─► Page 1: fetch orders 500–999 → accumulate totals
              ├─► Page N: fetch last chunk      → accumulate totals
              │
              └─► Save DailySalesReport (totalOrders, totalRevenue, status=COMPLETED)
```

Files: `report/scheduler/DailySalesJob.java`, `report/service/DailySalesReportService.java`

---

### 5. Load Distribution

Run multiple instances of the app behind an Nginx load balancer using `least_conn` strategy — requests go to the instance with the fewest active connections (better than round-robin for variable-length requests like checkout vs. browsing).

```
Client → Nginx (least_conn) → app instance :8080
                            → app instance :8081
                            → app instance :8082
```

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/verify-email` | Verify email address |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Products (GET is public, POST requires ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create product (ADMIN only) |

### Orders (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order — **Optimistic Locking** |
| POST | `/api/orders/flash-sale` | Flash sale order — **Pessimistic Locking** |

### Flash Sales (GET is public, POST requires ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flash-sales/{id}` | Get flash sale details |
| POST | `/api/flash-sales` | Create flash sale (ADMIN only) |

---

## Running the Application

### Option 1 — Docker Compose (recommended)

**Step 1:** Build the Docker image using Jib (no Dockerfile needed):
```bash
./mvnw jib:dockerBuild
```

**Step 2:** Start all services (PostgreSQL, Redis, App) in the correct order:
```bash
docker-compose up -d
```

Docker Compose uses `depends_on` with `condition: service_healthy` — the app will not start until both PostgreSQL and Redis pass their health checks.

**Step 3:** Check logs:
```bash
docker-compose logs -f app
```

**Step 4:** Stop everything:
```bash
docker-compose down
```

To also delete stored data (volumes):
```bash
docker-compose down -v
```

---

### Option 2 — Run Locally (requires local PostgreSQL + Redis)

**Step 1:** Make sure PostgreSQL is running on port `6000` with database `authdb`, and Redis is running on port `6379`.

**Step 2:** Run the application:
```bash
./mvnw spring-boot:run
```

---

## Environment Variables

All variables have safe defaults for local development. Override them in production.

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL hostname |
| `DB_PORT` | `6000` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `1234` | PostgreSQL password |
| `REDIS_HOST` | `localhost` | Redis hostname |
| `REDIS_PORT` | `6379` | Redis port |
| `REDIS_PASSWORD` | _(empty)_ | Redis password |
| `JWT_SECRET` | _(dev default)_ | Must be 64+ characters in production |
| `MAIL_HOST` | `sandbox.smtp.mailtrap.io` | SMTP server |
| `MAIL_PORT` | `2525` | SMTP port |
| `MAIL_USERNAME` | _(empty)_ | SMTP username |
| `MAIL_PASSWORD` | _(empty)_ | SMTP password |
| `GOOGLE_CLIENT_ID` | `placeholder` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | `placeholder` | Google OAuth2 client secret |
| `GITHUB_CLIENT_ID` | `placeholder` | GitHub OAuth2 client ID |
| `GITHUB_CLIENT_SECRET` | `placeholder` | GitHub OAuth2 client secret |
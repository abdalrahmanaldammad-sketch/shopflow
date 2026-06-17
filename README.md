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
- [Load Testing & Benchmarks](#load-testing--benchmarks)
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

### 6. Distributed Caching — Redis

The hot product-read path is cached in Redis so repeated reads under load are served from memory instead of hitting PostgreSQL on every request.

- `@Cacheable` on `ProductService.findAll()` / `findById()` — caches `ProductResponse` **DTOs** (never JPA entities) in Redis with a 60s TTL.
- `@CacheEvict(allEntries = true)` on every write (product create, stock decrement) — the catalog never serves stale stock.
- The cache manager is **config-gated**: `spring.cache.type=redis` (default) uses Redis; `spring.cache.type=none` falls back to a no-op cache. The **same image** therefore runs both the "before" and "after" benchmark — only config differs.

Files: `shared/config/CacheConfig.java`, `product/service/ProductService.java`, `product/strategy/OptimisticPurchaseStrategy.java`

> Caching only pays off when the cached read is **expensive**. Against a large catalog (5,000 products), enabling Redis cut read **p99 by ~83%** and raised throughput **5×** under load. Measured numbers and the full story are in [REQ_6_9_10_GUIDE.md](REQ_6_9_10_GUIDE.md).

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
./mvnw clean compile jib:dockerBuild
```
> `compile` is required — `jib:dockerBuild` packages `target/classes` but does not compile, and `clean` just removed them.

**Step 2:** Start all services (PostgreSQL, Redis, App) in the correct order:
```bash
docker compose up -d
```

Docker Compose uses `depends_on` with `condition: service_healthy` — the app will not start until both PostgreSQL and Redis pass their health checks. Nginx is published on host port **8080**, Grafana on **3000**.

**Step 3:** Check logs:
```bash
docker compose logs -f app
```

**Step 4:** Stop everything:
```bash
docker compose down
```

To also delete stored data (volumes):
```bash
docker compose down -v
```

---

### Option 2 — Run Locally (requires local PostgreSQL + Redis)

**Step 1:** Make sure PostgreSQL is running on port `6000` with database `authdb`, and Redis is running on port `6379`.

**Step 2:** Run the application:
```bash
./mvnw spring-boot:run
```

---

## Load Testing & Benchmarks

Stress testing (**Req 9**) and before/after benchmarking (**Req 10**) are driven by JMeter (official Docker image) against the app behind nginx. Everything runs through **one script** — no JMeter install, no manual compose juggling.

> Auth is disabled **only** under the `loadtest` Spring profile (activated by the override compose files the script uses), so the load test measures the engineering, not login. A plain `docker compose up` keeps full auth on.

**One-time — build the image:**
```bash
./loadtest/bench.sh build      # re-run only after Java code changes
```

**Run a requirement (each is fully self-contained and prints its result):**
```bash
./loadtest/bench.sh integrity  # Req 9    — writes only, 20-product catalog, high contention → proves NO DATA LOSS
./loadtest/bench.sh cache      # Req 6/10 — reads only, 5000-product catalog → caching BEFORE vs AFTER
```

**Tear down:**
```bash
./loadtest/bench.sh down
```

Each command resets the stack, seeds the right catalog, runs the test, and prints the answer:
- **`integrity`** → a PASS/FAIL invariant check (`stock sold == units sold == confirmed orders`).
- **`cache`** → a before/after latency table (cache off vs cache on).

HTML reports land in `loadtest/results/`. Tunables: `DURATION` (measure seconds, default 120), `WARMUP` (default 60), `SEED_INTEGRITY` (default 20), `SEED_CACHE` (default 5000) — e.g. `DURATION=60 ./loadtest/bench.sh integrity`.

📄 Full walkthrough, methodology, and measured numbers: **[REQ_6_9_10_GUIDE.md](REQ_6_9_10_GUIDE.md)**.

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
| `SPRING_PROFILES_ACTIVE` | _(empty)_ | Set to `loadtest` to seed demo data + open order endpoints (load testing only) |
| `SPRING_CACHE_TYPE` | `redis` | `redis` = caching on; `none` = caching off (for the "before" benchmark) |
| `LOADTEST_SEED_PRODUCTS` | `5000` | Catalog size seeded under the `loadtest` profile |
| `JWT_SECRET` | _(dev default)_ | Must be 64+ characters in production |
| `MAIL_HOST` | `sandbox.smtp.mailtrap.io` | SMTP server |
| `MAIL_PORT` | `2525` | SMTP port |
| `MAIL_USERNAME` | _(empty)_ | SMTP username |
| `MAIL_PASSWORD` | _(empty)_ | SMTP password |
| `GOOGLE_CLIENT_ID` | `placeholder` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | `placeholder` | Google OAuth2 client secret |
| `GITHUB_CLIENT_ID` | `placeholder` | GitHub OAuth2 client ID |
| `GITHUB_CLIENT_SECRET` | `placeholder` | GitHub OAuth2 client secret |
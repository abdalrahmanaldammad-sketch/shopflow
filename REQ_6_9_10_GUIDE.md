# Requirements 6, 9, 10 — Caching, Stress Testing & Benchmarking

A complete guide to what was implemented and how to run it.

- **Req 6 — Distributed Caching (Redis):** cache the hot product-read path.
- **Req 9 — Stress Testing:** prove 100 concurrent users with no crash and no data loss (JMeter).
- **Req 10 — Benchmarking & Bottleneck Analysis:** measure before/after, identify the bottleneck.

> Reqs 1–5, 7, 8 were already implemented before this work.

---

## Part 1 — What we built

### Req 6: Redis caching for products
| File | What it does |
|---|---|
| `shared/config/CacheConfig.java` | Enables caching; Redis cache manager, 60s TTL, JSON values. Backs off when `spring.cache.type=none` (used for the benchmark "before" run). |
| `product/service/ProductService.java` | `@Cacheable` on `findAll`/`findById` (caches `ProductResponse` DTOs, not JPA entities); `@CacheEvict` on `create`. |
| `product/strategy/OptimisticPurchaseStrategy.java` | `@CacheEvict` when stock is decremented, so the catalog never serves stale stock. |
| `product/dto/response/ProductResponse.java` | Made Jackson-deserializable so it can round-trip through Redis. |

**Idea:** repeated product reads are served from Redis instead of Postgres. Writes (stock
changes) evict the cache to stay correct. The write path is *not* cached — it needs strong
consistency (optimistic locking + ACID).

### Req 9 + 10: Stress test harness
| File | What it does |
|---|---|
| `loadtest/shopflow.jmx` | JMeter plan: 100 users loop `GET /api/products` → `POST /api/orders`. Parameterized via `-Jhost/port/threads/duration`. |
| `docker-compose.yml` (`jmeter` service) | JMeter as an on-demand container under the `tools` compose profile (doesn't start on normal `up`). |
| `docker-compose.loadtest.yml` | Override that turns on the `loadtest` Spring profile (cache on). |
| `docker-compose.nocache.yml` | Override that turns caching off, for the "before" run. |

### Auth disabled for the demo (so the benchmark measures engineering, not login)
| File | What it does |
|---|---|
| `shared/LoadTestDataInitializer.java` | Under the `loadtest` profile, seeds a demo user + 10 products (100,000 stock each). |
| `shared/config/SecurityConfig.java` | Under the `loadtest` profile, opens `POST /api/orders/**`. Default profile keeps auth on. |
| `order/controller/OrderController.java`, `order/service/OrderService.java` | When there's no logged-in user, orders run as the seeded demo user. |

> **Two different "profiles" — don't confuse them:**
> - `SPRING_PROFILES_ACTIVE=loadtest` is a **Spring** profile (seeds data, disables auth).
> - The `tools` profile on the JMeter service is a **Docker Compose** profile (controls which
>   containers start). Unrelated mechanisms.

---

## Part 2 — How to run it (step by step)

### Prerequisites
- Docker Desktop running.
- Run all commands from the repo root.

### Step 1 — Build the app image
```bash
./mvnw clean compile jib:dockerBuild
```
> `compile` is required: `jib:dockerBuild` packages `target/classes` but does not compile, and
> `clean` just deleted them.

### Step 2 — Start the stack (AFTER run = caching ON)
```bash
docker compose -f docker-compose.yml -f docker-compose.loadtest.yml up -d --scale app=2
```
This starts: 2 app instances, nginx (load balancer), Postgres, Redis, Prometheus, Grafana.

### Step 3 — Verify it seeded
```bash
curl -s http://localhost:8080/api/products | head -c 500
```
> nginx is published on host port **8080** (port 80 is often already taken). Grafana = `:3000`.
Expect JSON containing `"Load Test Product 1"`. If `data` is empty, the profile didn't activate.

### Step 4 — Run the stress test (cache ON)
Run as a **single line** (multi-line `\` continuations break in some shells):
```bash
docker compose run --rm jmeter -n -t /test/shopflow.jmx -Jhost=nginx -Jport=80 -Jduration=120 -l /test/results/after.jtl -e -o /test/results/after
```
Open the report at `loadtest/results/after/index.html`.
> If JMeter complains the output is not empty, clear it first: `rm -rf loadtest/results/after*`.

### Step 5 — Run the "before" pass (cache OFF) for the comparison
```bash
docker compose -f docker-compose.yml -f docker-compose.loadtest.yml -f docker-compose.nocache.yml up -d --scale app=2
```
```bash
docker compose run --rm jmeter -n -t /test/shopflow.jmx -Jhost=nginx -Jport=80 -Jduration=120 -l /test/results/before.jtl -e -o /test/results/before
```
Same image, only config differs — a fair before/after comparison.

### Step 6 — Tear down
```bash
docker compose down            # add -v to also wipe the database
```

---

## Part 3 — Benchmark results (Req 10)

Measured run: 100 concurrent users, 120s, via nginx over 2 app instances. ~257 req/s sustained,
no crash. Source: `loadtest/results/{before,after}/index.html`.

### GET /api/products — the cached read path (Req 6)
| Metric | Before (no cache) | After (Redis) | Improvement |
|---|---|---|---|
| median (ms) | 12 | 7 | **−42%** |
| p95 (ms) | 101 | 43 | **−57%** |
| p99 (ms) | 179 | 74 | **−59%** |
| mean (ms) | 26.3 | 12.9 | **−51%** |
| errors | 0 | 0 | — |

The win is in the **tail**: uncached, every read competes for the 10-connection Hikari pool, so
p95/p99 balloon under load. With Redis, repeat reads skip Postgres entirely → p99 cut by ~59%.

### POST /api/orders — write path (NOT cached), same run
| Metric | Before | After |
|---|---|---|
| median (ms) | 28 | 19 |
| p95 (ms) | 189 | 83 |
| p99 (ms) | 306 | 131 |
| error % | 14.8 | 14.5 |

**Notable secondary effect:** the order path got faster too (p99 306→131 ms) *even though it
isn't cached*. Reason — caching reads frees DB connections in the **shared HikariCP pool**, so the
write path waits less. This pinpoints the real bottleneck.

**Bottleneck identified:** the shared Postgres connection pool (`maximum-pool-size: 10`). Under 100
users, uncached reads saturate it and everything queues. **Fix (Req 6):** cache the read path in
Redis → frees the pool → both reads *and* writes speed up.

**Second bottleneck (write contention):** the ~14.5% order errors are **not data loss** — they are
the optimistic lock (Req 7) *correctly rejecting* conflicting writes when 100 threads fight over
only 10 product rows (~10 writers/row). See Part 4: every successful order is consistent. To lower
this rejection rate, spread load over more products (a real catalog has thousands, not 10) or raise
`MAX_RETRIES` in `OptimisticPurchaseStrategy`.

**AOP monitoring:** per-request latency is logged by `shared/config/RequestLoggingAspect.java`
(an `@Around` advice over all controllers) — the AOP performance monitoring the brief asks to document.

---

## Part 4 — Data integrity check (Req 9: "no data loss")

The headline result — under 100 concurrent users, no overselling (locking + ACID hold).

```bash
docker exec -it shopflow-postgres psql -U postgres -d authdb
```
```sql
SELECT sum(stock_quantity) AS stock_now FROM products;
SELECT count(*) AS confirmed_orders FROM orders WHERE status = 'CONFIRMED';
SELECT sum(quantity) AS units_sold FROM order_items;
```
Invariant: **`(seeded stock) - stock_now == units_sold == confirmed_orders`** and no order is lost
or duplicated. Seeded stock = 10 products × 100,000 = 1,000,000.

Measured (cumulative over the benchmark runs):
| Check | Value |
|---|---|
| stock sold (1,000,000 − stock_now) | 65,126 |
| units_sold (sum of order_items) | 65,126 |
| confirmed_orders | 65,126 |
| **Invariant holds?** | **✅ exact — no overselling, no lost/duplicated units** |

This is the key proof: even with ~14.5% of order attempts *rejected* under contention, every
unit of stock removed maps to exactly one order item and one confirmed order. The lock turns a
race condition into a clean rejection, never corrupt data.
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
curl -s http://localhost/api/products | head -c 500
```
Expect JSON containing `"Load Test Product 1"`. If `data` is empty, the profile didn't activate.

### Step 4 — Run the stress test (cache ON)
```bash
docker compose run --rm jmeter \
  -n -t /test/shopflow.jmx -Jhost=nginx -Jport=80 -Jduration=120 \
  -l /test/results/after.jtl -e -o /test/results/after
```
Open the report at `loadtest/results/after/index.html`.

### Step 5 — Run the "before" pass (cache OFF) for the comparison
```bash
# redeploy with caching off
docker compose -f docker-compose.yml -f docker-compose.loadtest.yml -f docker-compose.nocache.yml up -d --scale app=2

docker compose run --rm jmeter \
  -n -t /test/shopflow.jmx -Jhost=nginx -Jport=80 -Jduration=120 \
  -l /test/results/before.jtl -e -o /test/results/before
```
Same image, only config differs — a fair before/after comparison.

### Step 6 — Tear down
```bash
docker compose down            # add -v to also wipe the database
```

---

## Part 3 — Benchmark results (Req 10)

Fill these in from the JMeter dashboards (`loadtest/results/before|after/index.html`) and Grafana
(`http://localhost:3000`, admin/admin).

### GET /api/products
| Metric | Before (no cache) | After (Redis) | Improvement |
|---|---|---|---|
| p50 (ms) | … | … | … |
| p95 (ms) | … | … | … |
| p99 (ms) | … | … | … |
| Throughput (req/s) | … | … | … |
| Error % | … | … | — |

### DB connection pool (Grafana → `hikaricp_connections_pending`)
| Metric | Before | After |
|---|---|---|
| pending (peak) | … | … |
| active (peak) | … | … |

**Bottleneck:** before caching, every `GET /api/products` hits Postgres; at 100 users the Hikari
pool (`maximum-pool-size: 10`) saturates and requests queue (`pending > 0`), inflating p95/p99.
**Fix (Req 6):** Redis serves repeated reads, freeing DB connections → lower latency, higher
throughput.

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
Invariant: **`(seeded stock) - stock_now == units_sold`** and no order is lost or duplicated.
Seeded stock = 10 products × 100,000 = 1,000,000.

| Check | Value |
|---|---|
| stock_now | … |
| units_sold | … |
| confirmed_orders | … |
| Invariant holds? | … |
# Requirements 6, 9, 10 — Caching, Stress Testing & Benchmarking

- **Req 6 — Caching:** cache product reads in Redis.
- **Req 9 — Stress Testing:** 100 users, no crash, no data loss (JMeter).
- **Req 10 — Benchmark:** measure before vs after caching.

---

## How to run

```bash
./loadtest/bench.sh build       # once (and after any Java change)
./loadtest/bench.sh integrity   # Req 9    — proves no data loss
./loadtest/bench.sh cache       # Req 6/10 — caching before vs after
./loadtest/bench.sh down        # stop + clean up
```

Each command sets everything up, runs the test, and prints the result. Nothing else to do.

> Auth is turned off only under the `loadtest` profile (the script handles this), so the test
> measures performance, not login. A normal `docker compose up` keeps auth on.

---

## What was built

| File | Purpose |
|---|---|
| `shared/config/CacheConfig.java` | Redis cache, 60s TTL. Off when `spring.cache.type=none`. |
| `product/service/ProductService.java` | `@Cacheable` on reads, `@CacheEvict` on writes. |
| `loadtest/shopflow-writeonly.jmx` | Write-only plan (POST orders) — Req 9. |
| `loadtest/shopflow-readonly.jmx` | Read-only plan (GET only) — Req 6/10. |
| `loadtest/bench.sh` | One script that runs both scenarios. |

The two scenarios are opposite on purpose:
- **integrity** = writes only, small catalog (20 products) → high contention → shows the lock working.
- **cache** = reads only, big catalog (5000 products) → expensive reads → shows caching helping.

---

## Results

### Req 9 — No data loss
After the stress run, the database invariant holds exactly:

```
stock sold = units sold = confirmed orders   ✅
```

Every unit removed maps to one order item and one confirmed order. No overselling.

### Req 6 / 10 — Caching (5000 products, read-only)

| GET /api/products | cache OFF | cache ON |
|---|---|---|
| p99 latency | 98,761 ms | 16,808 ms |
| throughput | 1.0 req/s | 5.0 req/s |
| errors | 2.55% | 0% |

**Caching cut p99 by ~83% and gave 5× the throughput.**

Note: caching only helps when the read is expensive. With a tiny catalog the database is already
fast, so caching adds overhead instead — that's why the benchmark uses 5000 products.

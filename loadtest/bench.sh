#!/usr/bin/env bash
#
# ShopFlow load-test runner — two clean, self-contained scenarios.
#
#   ./loadtest/bench.sh build       Build the app image (run once, or after code changes)
#   ./loadtest/bench.sh integrity   Req 9  — small catalog, high contention → proves NO DATA LOSS
#   ./loadtest/bench.sh cache       Req 6/10 — big catalog, read-heavy → BEFORE/AFTER caching
#   ./loadtest/bench.sh down        Stop everything and wipe volumes
#
# Tunables (env vars): DURATION (measure secs, default 120), WARMUP (default 60),
#                      READ_USERS (cache test, default 20), WRITE_USERS (integrity test, default 100),
#                      SEED_INTEGRITY (default 20), SEED_CACHE (default 5000).
# Weak machine? Lower the load, e.g.:  READ_USERS=10 DURATION=60 ./loadtest/bench.sh cache
#
set -eu

cd "$(dirname "$0")/.."            # repo root, regardless of where it's called from

DURATION="${DURATION:-120}"
WARMUP="${WARMUP:-60}"
SEED_INTEGRITY="${SEED_INTEGRITY:-20}"
SEED_CACHE="${SEED_CACHE:-5000}"
WRITE_USERS="${WRITE_USERS:-100}"   # concurrent users for the integrity (write) test
READ_USERS="${READ_USERS:-20}"      # concurrent users for the cache (read) test — lower = lighter on your machine
THREADS="$WRITE_USERS"              # current scenario's user count (set per scenario below)
STOCK=100000                        # must match SEED_STOCK_PER_PRODUCT in LoadTestDataInitializer
URL="http://localhost:8080/api/products"

DC="docker compose"
BASE="-f docker-compose.yml -f docker-compose.loadtest.yml"   # loadtest profile, cache ON
NOCACHE="$BASE -f docker-compose.nocache.yml"                 # + cache OFF

banner() { echo; echo "═══════════════════════════════════════════════════════════"; echo "  $*"; echo "═══════════════════════════════════════════════════════════"; }

reset() { echo ">> resetting stack (wiping volumes)…"; $DC down -v >/dev/null 2>&1 || true; }

# up <compose-files...> — bring the stack up at 2 app instances
up() { $DC $1 up -d --scale app=2 >/dev/null; }

# wait_ready <expected_product_count>
wait_ready() {
  echo ">> waiting for app to seed $1 products…"
  for i in $(seq 1 100); do
    cnt=$(curl -s "$URL" 2>/dev/null | grep -o '"id"' | wc -l || true)
    if [ "${cnt:-0}" -ge "$1" ]; then echo ">> ready (~$((i*3))s, $cnt products)"; return 0; fi
    sleep 3
  done
  echo "!! ERROR: app did not become ready"; $DC logs --tail 40 app; exit 1
}

# jmeter <plan> <duration> [out-name]   (no out-name = throwaway warm-up)
jmeter() {
  if [ "${3:-}" = "" ]; then
    $DC run --rm jmeter -n -t "/test/$1" -Jhost=nginx -Jport=80 -Jthreads="$THREADS" -Jduration="$2" 2>&1 | grep -E '^summary =' | tail -1
  else
    rm -f "loadtest/results/$3.jtl"
    $DC run --rm jmeter -n -t "/test/$1" -Jhost=nginx -Jport=80 -Jthreads="$THREADS" -Jduration="$2" \
       -l "/test/results/$3.jtl" 2>&1 | grep -E '^summary =' | tail -1
  fi
}

psql_val() { docker exec shopflow-postgres psql -U postgres -d authdb -t -A -c "$1" | tr -d '[:space:]'; }

check_integrity() {
  local seeded sold units orders
  seeded=$(( $(psql_val "SELECT count(*) FROM products;") * STOCK ))
  sold=$(psql_val "SELECT $seeded - COALESCE(sum(stock_quantity),0) FROM products;")
  units=$(psql_val "SELECT COALESCE(sum(quantity),0) FROM order_items;")
  orders=$(psql_val "SELECT count(*) FROM orders WHERE status='CONFIRMED';")
  echo "  stock sold (seeded - now) : $sold"
  echo "  units sold (order_items)  : $units"
  echo "  confirmed orders          : $orders"
  echo
  if [ "$sold" = "$units" ] && [ "$units" = "$orders" ]; then
    echo "  ✅ PASS — every unit sold maps to exactly one order item and one confirmed order."
    echo "           No overselling, no lost or duplicated stock under 100 concurrent users."
  else
    echo "  ❌ FAIL — invariant broken (sold=$sold units=$units orders=$orders)."
    exit 1
  fi
}

cmd_build() { banner "BUILD"; ./mvnw -q clean compile jib:dockerBuild && echo ">> image shopflow:latest built"; }

cmd_integrity() {
  export LOADTEST_SEED_PRODUCTS="$SEED_INTEGRITY"
  THREADS="$WRITE_USERS"
  banner "DATA-INTEGRITY (Req 9) — $SEED_INTEGRITY products · $WRITE_USERS users · writes only · ${DURATION}s"
  reset
  up "$BASE"
  wait_ready "$SEED_INTEGRITY"
  echo ">> stress run (writes only)…"
  jmeter shopflow-writeonly.jmx "$DURATION" integrity
  banner "RESULT — Req 9 data integrity"
  check_integrity
  echo; echo "  Raw results: loadtest/results/integrity.jtl"
}

cmd_cache() {
  export LOADTEST_SEED_PRODUCTS="$SEED_CACHE"
  THREADS="$READ_USERS"
  banner "CACHE BENCHMARK (Req 6/10) — $SEED_CACHE products · $READ_USERS users · reads only · warm-up ${WARMUP}s · measure ${DURATION}s"
  reset
  echo "── BEFORE: cache OFF ──────────────────────────────────────"
  up "$NOCACHE"
  wait_ready "$SEED_CACHE"
  echo ">> warm-up…";  jmeter shopflow-readonly.jmx "$WARMUP"
  echo ">> measure…";  jmeter shopflow-readonly.jmx "$DURATION" big_before
  echo "── AFTER: cache ON (same DB, just flip the flag) ──────────"
  up "$BASE"
  wait_ready "$SEED_CACHE"
  echo ">> warm-up…";  jmeter shopflow-readonly.jmx "$WARMUP"
  echo ">> measure…";  jmeter shopflow-readonly.jmx "$DURATION" big_after
  banner "RESULT — Req 6/10 caching before vs after"
  python3 loadtest/analyze.py big_before big_after
  echo "  Raw results: loadtest/results/big_before.jtl  vs  big_after.jtl"
}

cmd_down() { banner "TEARDOWN"; $DC down -v; }

case "${1:-}" in
  build)     cmd_build ;;
  integrity) cmd_integrity ;;
  cache)     cmd_cache ;;
  down)      cmd_down ;;
  *) echo "usage: $0 {build|integrity|cache|down}"; exit 1 ;;
esac

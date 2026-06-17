#!/usr/bin/env python3
# Print per-endpoint latency stats from a JMeter .jtl results file.
# Reads loadtest/results/<run>.jtl (the raw CSV JMeter writes via -l), so it does not
# depend on the HTML dashboard report being generated.
#   python3 loadtest/analyze.py big_before big_after
import csv, sys, os
from collections import defaultdict


def pct(vals, p):
    if not vals:
        return 0
    k = (len(vals) - 1) * p
    f = int(k)
    c = min(f + 1, len(vals) - 1)
    if f == c:
        return vals[f]
    return vals[f] + (vals[c] - vals[f]) * (k - f)


def analyze(run):
    path = f"loadtest/results/{run}.jtl"
    if not os.path.exists(path):
        print(f"  {run}: no results file ({path}) — the run produced no data.")
        return
    rows = []
    with open(path, newline="") as fh:
        for row in csv.DictReader(fh):
            if row.get("elapsed") and row.get("label"):
                rows.append(row)
    if not rows:
        print(f"  {run}: results file is empty.")
        return

    groups = defaultdict(list)
    for row in rows:
        groups[row["label"]].append(row)
    tmin = min(int(r["timeStamp"]) for r in rows)
    tmax = max(int(r["timeStamp"]) + int(r["elapsed"]) for r in rows)
    span = (tmax - tmin) / 1000.0 or 1.0

    print(f"=== {run} ===")
    for label, rs in groups.items():
        el = sorted(int(x["elapsed"]) for x in rs)
        n = len(rs)
        errs = sum(1 for x in rs if x.get("success") != "true")
        print(f"  {label:32} n={n:>6} err%={100*errs/n:5.1f} "
              f"median={pct(el,.5):7.0f} p95={pct(el,.95):7.0f} p99={pct(el,.99):7.0f} "
              f"mean={sum(el)/n:7.0f} tps={n/span:6.1f}  (ms)")
    print()


for run in sys.argv[1:]:
    analyze(run)

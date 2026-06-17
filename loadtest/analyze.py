import json, sys

def row(run):
    d = json.load(open(f'loadtest/results/{run}/statistics.json'))
    g = next(v for k, v in d.items() if k.startswith('GET'))
    posts = [v for k, v in d.items() if k.startswith('POST')]
    p = posts[0] if posts else None
    t = d['Total']
    print(f"{run:12} | GET  n={g['sampleCount']:>6} median={g['medianResTime']:>6.0f} "
          f"p95={g['pct2ResTime']:>6.0f} p99={g['pct3ResTime']:>6.0f} mean={g['meanResTime']:>6.1f} "
          f"tps={g['throughput']:>6.1f}")
    if p:
        print(f"{'':12} | POST n={p['sampleCount']:>6} median={p['medianResTime']:>6.0f} "
              f"p95={p['pct2ResTime']:>6.0f} p99={p['pct3ResTime']:>6.0f} mean={p['meanResTime']:>6.1f} "
              f"err%={p['errorPct']:.2f}")
    print(f"{'':12} | TOTAL tps={t['throughput']:.1f}  err%={t['errorPct']:.2f}  mean={t['meanResTime']:.1f}")
    print()

for run in sys.argv[1:]:
    row(run)

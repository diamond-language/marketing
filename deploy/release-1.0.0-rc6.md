# d6 1.0.0-rc6 site deployment

Deployed and verified on 2026-11-15 UTC (2026-11-14 Pacific), after all four native packages
were published by release workflow 43675896933.

- Marketing source: `9dcbe9a` (green PR #44, merged): rc6 cards, version and download links
  (first deployed with #43), GitHub links to diamond-language/d6, and the registry at
  cuts.rolld6.codes.
- Runtime/docs source: d6 `1.0` at `0b310af1`, which is tag `v1.0.0-rc6` plus the domain
  cleanup and registry-address changes (#585 to #588).
- Fresh browser module SHA-256:
  `1450f80beead47ad85d67d83b6dd9cfe3179a47c3948b845c491b173ec62ed47`. `wasm/cuts.json` was
  regenerated from that tree's mjolnir and arel.
- `make test-wasm` and all nine homepage/REPL checks passed. The generated docs contain 62
  pages; all 5,435 link checks passed.
- Live checks over HTTPS: the served WASM digest with `application/wasm` and `no-cache`, rc6 on
  the homepage, no links to the former repository name, and the docs index, rc6 release page
  and cut pages.

The previous document root (with /docs) is retained in
`/root/d6-rc6-rollback-20261115/site.tar.gz`. nginx and TLS were not touched.

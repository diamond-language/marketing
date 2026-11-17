# d6 1.0.0 site deployment

Deployed and verified on 2026-11-17 UTC (2026-11-16 Pacific), after release workflow 43991334091
published all four packages, both tarballs and the VS Code extension.

- Marketing source: `0156256` (green PR #46, merged): 1.0.0 version and download links, Recent
  changes cards for the compatibility promise, mise tarballs and the Marketplace extension, and
  `cd d6` in the source-install tabs (they said `cd diamond`).
- Runtime/docs source: d6 tag `v1.0.0`, `91fdb43a`.
- Fresh browser module SHA-256:
  `5b077ab7c764e83da4dc66b524f0e59cee5da5eb30df5c936e04404e12e82770`. `wasm/cuts.json` was
  regenerated from the tag's mjolnir and arel and came out unchanged.
- `make test-wasm` and all nine REPL tests passed. The generated docs contain 65 pages; all 5,712
  link checks passed. The cards were rendered at 1300 px and 390 px before deploying.
- Live checks over HTTPS: 1.0.0 on the homepage and no rc references, all four download links,
  the served WASM digest with `application/wasm` and `no-cache`, and the docs' 1.0.0 release page,
  getting started (with the Marketplace link), compatibility and cut pages.
- `RELEASE`, `REVISION` and `RUNTIME_REVISION` in the document root now say 1.0.0, `0156256`
  and `91fdb43a` (they had been left at rc4).

The previous document root (with /docs) is retained in
`/root/d6-1.0.0-rollback-20261117/site.tar.gz`. nginx and TLS were not touched.

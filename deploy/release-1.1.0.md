# d6 1.1.0 site deployment

Deployed and verified on 2026-11-19 UTC (2026-11-18 Pacific), after release workflow 44425137598
published all eight packages, both tarballs and the VS Code extension.

- Marketing source: `89738b7` (green PR #50): the 1.1.0 version and download links.
- Runtime/docs source: d6 tag `v1.1.0`, `8fc5a2d5`.
- Fresh browser module SHA-256:
  `a5a64e87196f998e3bff62978fd895a50c39b383f314515db06acd0e1d673668`, built from a `git archive`
  of the tag. mjolnir and arel are unchanged since 1.0.1, so `wasm/cuts.json` is too.
- `make test-wasm` and all nine REPL tests passed. The generated docs contain 66 pages (the new
  page is the 1.1.0 release notes); the link check passed in d6 PR #610's CI.
- Live checks over HTTPS: 1.1.0 on the homepage and no 1.0.1 references, all six download links
  return 200, the served WASM digest with `application/wasm` and `no-cache`, and the docs' 1.1.0
  release page, getting started and local I/O pages.
- `RELEASE`, `REVISION` and `RUNTIME_REVISION` in the document root now say 1.1.0, `89738b7`
  and `8fc5a2d5`.

The previous document root (with /docs) is retained in
`/root/d6-1.1.0-rollback-20261119/site.tar.gz`. nginx and TLS were not touched.

# D6 1.0.0-rc5 site deployment

Deployed and verified on 2026-11-14 UTC (2026-11-13 Pacific), after all four native packages
were published by release workflow 43548488056.

- Marketing source: `db6f0fd` (green PR #36, merged).
- Runtime/docs source: `e4864b4c8fa753be8e1e494fa643b51e4dab62e1`, tag `v1.0.0-rc5`.
- Fresh browser module SHA-256:
  `91bcc86a028af12c2f526db3e42a5c363168901f3f246d1142c07c1937b47181`.
- `make test-wasm` and all nine homepage/REPL checks passed. The generated docs contain 39
  pages; all 2,419 link checks passed.
- The live homepage eyebrow, served WASM checksum and `application/wasm` type, the docs
  index and rc5 release page, and the native download URLs were verified over HTTPS.

The previous document root is retained in
`/root/diamond-rc5-rollback-20261113/marketing.tar.gz`. nginx, TLS and domain redirects
were not touched.

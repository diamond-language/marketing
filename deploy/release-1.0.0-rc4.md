# d6 1.0.0-rc4 site deployment

Deployed and verified on 2026-11-12 UTC (2026-11-11 Pacific), after all four native packages
were published and their downloaded sizes, SHA-256 digests and public URLs passed checks.

- Marketing source: `241c3414a93e467b41fb1609f610585f38cbbb3f` (green PR #33, merged).
- Runtime/docs source: `0e482f26c56854c4c41c6c82d093ad04f6569a21`, tag `v1.0.0-rc4`
  (all 37 release PR checks passed).
- Fresh browser module SHA-256:
  `be08de3253267b7771af848e34b8c5288521f69176aae60081c19a2074a342f2`.
- WASM and all nine homepage/REPL checks passed. The generated docs contain 38
  pages; all 2,330 link checks passed.
- The live homepage/release page, root revision files, all four native download
  URLs and served WASM checksum were verified over HTTPS.

The previous document root is retained in
`/root/diamond-rc4-rollback-20261111/marketing.tar.gz`. Existing nginx/TLS, ACME and
domain redirects were preserved; nginx syntax passed. No domain activation or
certificate replacement was needed. No browser surface was available for
manual visual/keyboard checks; functional module, build, link and HTTP checks passed.

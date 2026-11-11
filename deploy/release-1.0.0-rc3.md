# d6 1.0.0-rc3 site deployment

Deployed and verified on 2026-11-11, after the four native release packages
were published and their download URLs passed checks.

- Marketing source: `16119f115290a7e6e59037c1869ce5ec2c9cc920` (green PR #32).
- Runtime/docs source: `fdf6ab487f03fde5ece43290714a8f48b0922a16`, tag `v1.0.0-rc3`
  (all 37 runtime PR checks passed).
- Fresh browser module SHA-256:
  `71209e1085b311edc513509df6452b36ca0d2ea10d70858774abe52a0e45b897`.
- Native WASM suite and all nine homepage/REPL tests passed; the generated docs
  contain 37 pages, including the rc3 release notes and updated installation links.
- The deployed root revision files, rc3 homepage/release page, all four native
  download links and served WASM checksum were verified over HTTPS.

The previous document root is retained in
`/root/diamond-rc3-rollback-20261111/marketing.tar.gz`. The existing nginx/TLS,
ACME and domain-redirect configuration was preserved; its syntax check passed.
No domain activation or certificate replacement was needed.

No browser surface was available in the release session. Functional module,
homepage, build and HTTP checks passed; visual/keyboard interaction QA was not
performed. The release did not change layout or REPL interaction code.

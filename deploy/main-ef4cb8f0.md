# Browser runtime from D6 main ef4cb8f0

Deployed 2026-11-14 UTC from marketing `fa9fe25` (PR #37). Only `wasm/diamond.wasm`
changed: rebuilt from D6 main `ef4cb8f02e9c0e2dae5d0f16eb4b397eaae024ba` with
`make test-wasm` passing. The live file's SHA-256 matched the build,
`e2a19e489fd5a35ab3a4d9cedea15f383056e1056ec5d89bbcc37a037c12c5ae`. Homepage text,
nginx and TLS were not touched. The previous document root is in
`/root/diamond-head-rollback-20261113/marketing.tar.gz`.

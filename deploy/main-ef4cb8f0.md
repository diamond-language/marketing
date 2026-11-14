# Browser runtime from D6 main ef4cb8f0

Deployed 2026-11-14 UTC (2026-11-13 Pacific, hence the rollback directory's date) from
marketing `fa9fe25` (PR #37). Only `wasm/diamond.wasm` changed: rebuilt from D6 main
`ef4cb8f02e9c0e2dae5d0f16eb4b397eaae024ba`, which is rc5 plus `Hash.new(default)`,
`Array.new` with a block, the negative-literal binding and the IO.poll trapped-signal fix,
so the docs' examples run as written in the homepage REPL. `make test-wasm` passed.

Live checks: the served file's SHA-256 matched the build,
`e2a19e489fd5a35ab3a4d9cedea15f383056e1056ec5d89bbcc37a037c12c5ae`, with
`Content-Type: application/wasm` and `Cache-Control: no-cache`; the homepage returned 200.
`wasm/cuts.json` regenerated from D6 main's mjolnir and arel is unchanged, so it was left as is.
Homepage text, nginx and TLS were not touched. The previous document root is in
`/root/diamond-head-rollback-20261113/marketing.tar.gz`.

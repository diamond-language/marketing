# d6 1.7.0 site deployment

Published at [rolld6.codes](https://rolld6.codes/) on 2026-11-26 UTC.

The [tagged release workflow](https://github.com/diamond-language/d6/actions/runs/45778752419)
built the browser runtime from `ac3afb8e26b7a4f81ee9c1f88161fc1fa283020c`.
The homepage and browser assets were deployed from marketing commit
`4689b18b6a05876538f1c4c133f4ecdfd4df6379`. The live homepage reported
1.7.0, all six package downloads returned HTTP 200, and the served
WebAssembly SHA-256 matched `8e557125b50aeb766e5decf7b91bf04329fd48357a8317b6acb8ddea61080ec4`.

The curated docs were rebuilt with the packaged 1.7.0 runtime and
deployed from `a4a9cdb6443bda4d533a11cbcc3abfbc245f8e69`. The public docs
include the expanded networking, database, concurrency and package
references, the 1.7.0 notes, and consistent version labels in the Release
notes sidebar. The live documents matched the staged files.

The preceding 1.7.0 site is at
`/root/d6-1.7.0-docs-rollback.pswMNXEV/original-site`. The 1.6.2 site is at
`/root/d6-1.7.0-rollback.OZ1i3Ppc/original-site`.

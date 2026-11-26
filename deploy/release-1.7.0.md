# d6 1.7.0 site deployment

Published at [rolld6.codes](https://rolld6.codes/) on 2026-11-26 UTC.

The [tagged release workflow](https://github.com/diamond-language/d6/actions/runs/45778752419)
built the browser runtime from .
The homepage and browser assets were deployed from marketing commit
. The live homepage reported
1.7.0, all six package downloads returned HTTP 200, and the served
WebAssembly SHA-256 matched .

The curated docs were rebuilt with the packaged 1.7.0 runtime and
deployed from . The public docs
include the expanded networking, database, concurrency and package
references, the 1.7.0 notes, and consistent version labels in the Release
notes sidebar. The live documents matched the staged files.

The preceding 1.7.0 site is at
. The 1.6.2 site is at
.

# d6 1.6.1 site deployment

Published at [rolld6.codes](https://rolld6.codes/) on 2026-11-25 UTC.

| Component | Revision |
| --- | --- |
| Homepage and browser loader | `8672cc0f15f5f7c68b727abbcea0da3358535953` |
| Documentation sources | `DOCS_REVISION` in the deployed site root |
| Browser runtime | `v1.6.1` (`0c749ac3ae373bb533f708eafae1b5072e1c338d`) |

The docs were generated with the published 1.6.1 runtime and passed 750
example checks and 14,731 internal link checks. The public site served the
updated Getting Started guide and both release notes pages. All six package
links returned HTTP 200. The live WebAssembly module passed the typed
variadic parameter and type alias examples, and its SHA-256 was
`de7c5a8cebcc9a99ee2a9ab461c735c4145ee7757c0819f039601d0aad86bc0f`.

The site root was exchanged with the staged directory in a single rename.
The previous site is under `/root/d6-1.6.1-rollback.Cb8EjEI8/original-site`
on the droplet, with a verified file listing and a separate backup in
`/root/d6-1.6.1-rollback.Cb8EjEI8/site.tar.gz`.

# d6 1.0.1 site deployment

Deployed and verified on 2026-11-17 UTC, after release workflow 44165401036 published all eight
packages (the Fedora 45 rpms are new), both tarballs and the VS Code extension.

- Marketing source: `7d8cf56` (green PR #48). It has the 1.0.1 version and download links, a
  Fedora 45 download button with Fedora 44 links below it, a mise tab with what the prebuilt
  tarball needs, and a link from the install intro to the guide's comparison of install methods.
  Continuation lines in install terminals no longer show a `$` prompt.
- Runtime/docs source: d6 tag `v1.0.1`, `2f84c11b`.
- Fresh browser module SHA-256:
  `32be387110b7ff50a0ce56b00521c56645a86c1cbc03b7b1fdffaad5b4b4b1b1`. `wasm/cuts.json` was
  regenerated from the tag's mjolnir and arel and came out unchanged.
- `make test-wasm` and all nine REPL tests passed. The generated docs contain 65 pages; all 5,855
  link checks passed. The Fedora and mise tabs were rendered at 1300 px and 390 px before deploying.
- Live checks over HTTPS: 1.0.1 on the homepage and no 1.0.0 links, all six download links return
  200, the served WASM digest with `application/wasm` and `no-cache`, and the docs' 1.0.1 release
  page, getting started and compatibility pages.
- `RELEASE`, `REVISION` and `RUNTIME_REVISION` in the document root now say 1.0.1, `7d8cf56`
  and `2f84c11b`.

The previous document root (with /docs) is retained in
`/root/d6-1.0.1-rollback-20261117/site.tar.gz`. nginx and TLS were not touched.

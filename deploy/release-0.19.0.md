# Marketing candidate for Diamond 0.19.0

Prepared on 2026-10-23; not deployed. Ship this revision only alongside the
Diamond 0.19.0 release. The homepage version and highlights describe that release.

The review corrected `.d6`/`.d6c` examples, legacy `.di` compatibility and import
precedence, missing source checkout steps, C23/compiler prerequisites, Ubuntu's
validated version, FreeBSD/macOS build flags, the versioned Mjolnir install
command, query-count claims, and overly broad thread-safety claims. The pinned
Mjolnir 0.2.4 remains the published legacy cut; this does not announce the
unpublished `.d6` source cohort.

Tabs now expose panels and support arrow, Home, and End keys. Escape closes the
mobile menu, failed clipboard copies report failure, and REPL completions expose
their selected option. The WASM interpreter was rebuilt from the 0.19.0 candidate
using wasi-sdk 34 and passed the upstream REPL suite. All six homepage example
chips and repeated printed output were checked through this repository's exact
wrapper and staged module. Types intentionally reports a type error.

The native examples were also executed, using supporting application fixtures
where the page presents excerpts. The changeset, query, association, and
transaction examples passed against published Mjolnir 0.2.4 and Arel 0.34.6.
The query now uses a field declared by the schema shown on the page.
The staged module was built from Diamond candidate `232f2ea4`; its SHA-256 is
`d7fa1e3f8c2f94522be70cab40fb1353c74bef08e2bac24ca32ddaa227fc0bc5`.

Live HTTP checks found the canonical homepage and WASM asset available, with
legacy-domain path/query redirects working. `/wasm/` itself returned 403;
`nginx.conf` now redirects that legacy directory URL to `/#repl`. Deploy the
configuration with the page, scripts, styles, and module; updating HTML alone
does not fix that route. Preserve the existing TLS/ACME configuration and
`cuts.dilang.tech` service. Validate nginx before reloading it.

No browser surface was available during preparation. Before deployment, verify
desktop and mobile layout, horizontal scrolling of the longer build commands,
tab keyboard navigation, mobile Escape/focus, clipboard success/failure,
completion selection, and every chip in a real browser. After deployment,
confirm those behaviors again and check HTTPS root, legacy-domain redirects,
`/wasm/` redirect, and `application/wasm` delivery. Retain the previous static
files and nginx configuration for rollback. Do not rerun domain activation just
to update this release.

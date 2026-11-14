# d6 lowercase brand and die logo deployment

2026-11-14: deployed marketing `df4aac0` (PR #39). The brand is written d6 again
and the logo is the six face of a die. Changed files: `index.html`,
`css/style.css`, `favicon.svg` and `og-image.png`; `tools/og-image.svg` is the
image's source and is not served. The served files' sha256 matched the checkout
after the rsync. The /docs pages pick up the favicon from here; their "d6 docs"
wordmark comes with diamond #575.

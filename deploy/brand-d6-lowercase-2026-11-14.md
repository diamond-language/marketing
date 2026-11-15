# d6 lowercase brand and die logo deployment

2026-11-14: deployed marketing `df4aac0` (PR #39). The brand is written d6 again
and the logo is the six face of a die. Follow-up #40 (`5be1a57`, deployed the same day) turned the pips 45 degrees with the die and made them white. Changed files: `index.html`,
`css/style.css`, `favicon.svg` and `og-image.png`; `tools/og-image.svg` is the
image's source and is not served. The served files' sha256 matched the checkout
after the rsync. The /docs pages pick up the favicon from here; their "d6 docs"
wordmark comes with diamond #575.

Second follow-up #41 (`20693a4`, same day) shrank the pips (radius 1.75 to 1.4, grid pulled toward the centre) for more padding inside the die.

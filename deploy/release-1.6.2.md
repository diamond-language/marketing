# d6 1.6.2 site deployment

Published at [rolld6.codes](https://rolld6.codes/) on 2026-11-25 UTC.

The [tagged release workflow](https://github.com/diamond-language/d6/actions/runs/45561388548)
built the docs and browser runtime from `187119f39bc9371163c1e2d380d26237d4466cc1`. The source of the homepage
and browser loader is marketing commit `e4451e43148252188f40f4514691b7345db64dea`.

The bundle passed 750 runnable example checks and 14,733 internal link checks.
The live Getting Started guide and homepage reported 1.6.2, all six package
downloads returned HTTP 200, and the browser examples passed. The served
WebAssembly SHA-256 is `34b584d60926fdeacd6f491aaef7cb07adc2acc841a9820127d79650c5577fe4`.

The previous site is retained at `/root/d6-1.6.2-rollback.A7nYm5r8/original-site` on the droplet.

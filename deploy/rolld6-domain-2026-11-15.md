# rolld6.codes domain move

2026-11-15 (UTC): moved the site to `rolld6.codes` (PR #42). Let's Encrypt issued
the `rolld6.codes` certificate (webroot, expires 2027-02-13), `deploy/nginx.conf`
was installed and the new `index.html` (canonical `https://rolld6.codes/`) went
live. The previous files are in `/root/marketing-domain-backup-20261115T032019Z`.

Checked from outside after the switch: `https://rolld6.codes/` and `/docs/`
return 200, the former site domains (http and https) answer 301 to the same
path on `https://rolld6.codes/`, and the registry health check is ok. The live
nginx config and homepage matched the PR byte for byte.

Same day: the regenerated `og-image.png` (which the activation had not
installed) was deployed, the document root moved to `/var/www/rolld6.codes` and
the nginx file to `rolld6.conf` (backup in
`/root/site-rename-backup-20261115T041734Z`), and the old activation tooling was
removed from this repository.

Still open: `www.rolld6.codes` has no DNS record, and `cuts.d6.codes` waits on DNS.

# rolld6.codes domain move

2026-11-15 (UTC): activated `d323b36` (PR #42) with `deploy/activate.sh` on the
droplet. Let's Encrypt issued the `rolld6.codes` certificate (webroot, expires
2027-02-13); `deploy/nginx.conf` became `/etc/nginx/conf.d/dilang.conf` and the
new `index.html` (canonical `https://rolld6.codes/`) was installed. The previous
files are in `/root/marketing-domain-backup-20261115T032019Z`.

Checked from outside after the switch: `https://rolld6.codes/` and `/docs/`
return 200; `getdiamond.codes` and `dilang.tech` (http and https) answer 301 to
the same path on `https://rolld6.codes/`; `cuts.dilang.tech/health` is ok. The
live nginx config and homepage matched the PR byte for byte.

Still open: `www.rolld6.codes` has no DNS record, and `cuts.d6.codes` waits on DNS.

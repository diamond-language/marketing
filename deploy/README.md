# Canonical marketing domain

`rolld6.codes` is the canonical marketing origin (since 2026-11-14). `getdiamond.codes` and
`dilang.tech` redirect to it with the path and query preserved. `cuts.dilang.tech` and the SSH
hostname `root@dilang.tech` stay unchanged (the registry moves to `cuts.d6.codes` once that name
is set up). To switch, stage `activate.sh`, `nginx.conf` and the new `index.html` in one directory
on the droplet and run `activate.sh` as root: it issues the certificate, installs both, checks the
new origin and both redirects, and rolls back on any failure.

## History: getdiamond.codes (2026-10-22)

`getdiamond.codes` became the canonical origin on 2026-10-22, and `dilang.tech` began redirecting
with the path and query preserved. `cuts.dilang.tech` and the SSH hostname
`root@dilang.tech` stay unchanged. All services use the existing droplet at
`142.93.192.149`; the static document root remains `/var/www/dilang.tech`.

The shared nginx configuration continues serving HTTP ACME challenges and
redirecting other HTTP requests to HTTPS. Both marketing certificates renew
through the existing certbot timer and nginx reload hook.

Stage `activate.sh`, `nginx.conf`, and the repository's `index.html` under
`/root/diamond-marketing-domain/`. Install the service and timer in
`/etc/systemd/system/`, reload systemd, and enable the timer. Start the service
for an immediate attempt. It obtains the certificate before changing the live
site, backs up the previous files, validates nginx and HTTPS responses, and
rolls back if activation fails. The timer retries every 30 minutes and disables
itself after success. Check `journalctl -u diamond-marketing-domain.service`
and `/root/diamond-marketing-domain/activated` for the outcome.

Activated on 2026-10-22 at 06:31 UTC after DNS propagation. The certificate
expires on 2027-01-20 and uses certbot's existing automatic renewal setup.
Verified the canonical page, a redirect preserving `/wasm/?domain-check=1`, and
the unchanged registry health endpoint. The activation timer disabled itself
after success. The first attempt rolled back because nginx's new workers were
not ready immediately after reload; verification now retries during that handover.

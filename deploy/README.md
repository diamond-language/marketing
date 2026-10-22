# Canonical marketing domain

`getdiamond.codes` is the canonical marketing origin. `dilang.tech` redirects
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

On 2026-10-21, activation was staged while public DNS still returned NXDOMAIN.
The existing marketing site continues serving until certificate issuance succeeds.

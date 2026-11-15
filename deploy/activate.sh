#!/usr/bin/env bash
# Moves the site to rolld6.codes. Run as root on the droplet from a directory
# holding this script, nginx.conf and the new index.html (canonical rolld6.codes).
# Rolls back nginx and index.html if any check fails; safe to rerun.
set -euo pipefail
cd -- "$(dirname -- "$0")"
if [[ -f activated ]]; then
    exit 0
fi

# Leave the working site alone if the certificate can't be issued yet.
certbot certonly --non-interactive --webroot -w /var/www/letsencrypt \
    -d rolld6.codes --cert-name rolld6.codes --keep-until-expiring

backup="/root/marketing-domain-backup-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -m 700 "$backup"
cp -p /etc/nginx/conf.d/dilang.conf "$backup/dilang.conf"
cp -p /var/www/dilang.tech/index.html "$backup/index.html"
rollback() {
    cp -p "$backup/dilang.conf" /etc/nginx/conf.d/dilang.conf
    cp -p "$backup/index.html" /var/www/dilang.tech/index.html
    nginx -t && systemctl reload nginx
}
trap rollback ERR
install -m 644 nginx.conf /etc/nginx/conf.d/dilang.conf
install -m 644 index.html /var/www/dilang.tech/index.html
nginx -t
systemctl reload nginx
# nginx reload returns before the new workers finish taking over.
curl --retry 5 --retry-all-errors --retry-delay 1 --fail --silent --show-error --resolve rolld6.codes:443:127.0.0.1 \
    https://rolld6.codes/ | grep -F 'rel="canonical" href="https://rolld6.codes/"'
for old in getdiamond.codes dilang.tech; do
    curl --fail --silent --show-error --resolve "$old:443:127.0.0.1" \
        --head "https://$old/docs/?domain-check=1" \
        | tr -d '\r' | grep -Fi 'location: https://rolld6.codes/docs/?domain-check=1'
done
curl --fail --silent --show-error --resolve cuts.dilang.tech:443:127.0.0.1 \
    https://cuts.dilang.tech/health
trap - ERR
touch activated
echo "rolld6.codes is live; backup in $backup"

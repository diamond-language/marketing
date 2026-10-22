#!/usr/bin/env bash
# Run as root on the droplet, beside nginx.conf and the staged index.html.
set -euo pipefail
cd -- "$(dirname -- "$0")"
if [[ -f activated ]]; then
    exit 0
fi

# DNS may still be propagating. Leave the working site alone on failure.
certbot certonly --non-interactive --webroot -w /var/www/letsencrypt \
    -d getdiamond.codes --cert-name getdiamond.codes --keep-until-expiring

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
curl --retry 5 --retry-all-errors --retry-delay 1 --fail --silent --show-error --resolve getdiamond.codes:443:127.0.0.1 \
    https://getdiamond.codes/ | grep -F 'rel="canonical" href="https://getdiamond.codes/"'
curl --fail --silent --show-error --resolve dilang.tech:443:127.0.0.1 \
    --head 'https://dilang.tech/wasm/?domain-check=1' \
    | tr -d '\r' | grep -Fi 'location: https://getdiamond.codes/wasm/?domain-check=1'
curl --fail --silent --show-error --resolve cuts.dilang.tech:443:127.0.0.1 \
    https://cuts.dilang.tech/health
trap - ERR
touch activated
systemctl disable --now diamond-marketing-domain.timer

# Site deployment

The site is served at `https://rolld6.codes/` from `/var/www/rolld6.codes` on the droplet,
configured by `deploy/nginx.conf` (installed as `/etc/nginx/conf.d/rolld6.conf`). The
former site domains only redirect here, path and query preserved. The certificate renews
through certbot's timer and the nginx reload hook in `00-common.conf`'s setup.

To deploy the static files, dry-run then copy (no `--delete`, so `/docs` is left alone):

```sh
rsync -rcni --exclude .git --exclude .github --exclude deploy --exclude tests --exclude tools \
  ./ root@rolld6.codes:/var/www/rolld6.codes/
rsync -rc --chown=root:root --chmod=F644 --exclude .git --exclude .github --exclude deploy \
  --exclude tests --exclude tools ./ root@rolld6.codes:/var/www/rolld6.codes/
```

The `release-*.md` and dated files here record individual deployments.

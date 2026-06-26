#!/bin/bash
# =============================================================================
# OSCAR 3.0 — Docker Entrypoint Script
# Runs bootstrap tasks before starting services via Supervisor
# =============================================================================

set -e

echo "═══════════════════════════════════════════"
echo "  OSCAR 3.0 — Production Startup"
echo "═══════════════════════════════════════════"

# ── Ensure storage directories exist ──────────────────────────────────────────
echo "→ Setting up storage directories..."
mkdir -p /var/www/html/storage/app/public
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
mkdir -p /var/log/supervisor

# ── Fix permissions ───────────────────────────────────────────────────────────
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# ── Buat .env dari env_file Docker ───────────────────────────────────────────
# Docker inject env vars dari env_file ke container, tapi Laravel butuh
# file .env fisik di project root untuk php artisan commands.
echo "→ Writing .env file..."
if [ -f "/run/secrets/env_production" ]; then
    # Jika menggunakan Docker secrets
    cp /run/secrets/env_production /var/www/html/.env
elif [ -f "/var/www/html/.env.production" ]; then
    # Jika file .env.production di-mount langsung
    cp /var/www/html/.env.production /var/www/html/.env
else
    # Tulis dari environment variables yang sudah diinject Docker
    printenv | grep -v "^PATH\|^HOME\|^HOSTNAME\|^TERM\|^SHLVL\|^PWD\|^_=" \
        | sort > /var/www/html/.env
fi
chmod 600 /var/www/html/.env
chown www-data:www-data /var/www/html/.env
echo "   ✓ .env file ready"

# ── Cek APP_KEY ────────────────────────────────────────────────────────────────
echo "→ Checking environment variables..."
if [ -z "$APP_KEY" ]; then
    echo "⚠  WARNING: APP_KEY is not set! Generating one..."
    php artisan key:generate --force
fi

# ── Clear caches ──────────────────────────────────────────────────────────────
echo "→ Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# ── Run database migrations ───────────────────────────────────────────────────
echo "→ Running database migrations..."
php artisan migrate --force --no-interaction

# ── Optimize for production ───────────────────────────────────────────────────
echo "→ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan package:discover --ansi
php artisan filament:upgrade

# ── Create storage symlink ────────────────────────────────────────────────────
echo "→ Creating storage symlink..."
php artisan storage:link --force 2>/dev/null || true

echo "═══════════════════════════════════════════"
echo "  ✓ Bootstrap complete — Starting services"
echo "═══════════════════════════════════════════"

# ── Execute the main command (supervisord) ────────────────────────────────────
exec "$@"

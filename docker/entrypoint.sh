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

# ── Wait for environment to be ready ──────────────────────────────────────────
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
php artisan filament:upgrade

# ── Create storage symlink ────────────────────────────────────────────────────
echo "→ Creating storage symlink..."
php artisan storage:link --force 2>/dev/null || true

echo "═══════════════════════════════════════════"
echo "  ✓ Bootstrap complete — Starting services"
echo "═══════════════════════════════════════════"

# ── Execute the main command (supervisord) ────────────────────────────────────
exec "$@"

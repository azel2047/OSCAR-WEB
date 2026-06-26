# =============================================================================
# OSCAR 3.0 - Production Dockerfile
# Stack: Laravel 12 + React 18 (SPA) + Filament + PostgreSQL (Supabase)
# =============================================================================

# ── Stage 1: Node.js — Build React frontend assets ──────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy frontend source files
COPY vite.config.js tailwind.config.js postcss.config.js ./
COPY resources/ ./resources/
COPY public/ ./public/

# Build production assets
RUN npm run build


# ── Stage 2: Composer — Install PHP dependencies ─────────────────────────────
FROM composer:2.8 AS composer-builder

WORKDIR /app

COPY composer.json composer.lock ./

# Dibutuhkan oleh --optimize-autoloader untuk scan PSR-4 classmap
COPY app/ ./app/
COPY database/ ./database/
COPY bootstrap/ ./bootstrap/

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist \
    --ignore-platform-reqs


# ── Stage 3: Final Production Image ──────────────────────────────────────────
FROM php:8.2-fpm-alpine AS production

LABEL maintainer="OSCAR Dev Team"
LABEL description="OSCAR 3.0 - Production Image"

# Install system dependencies
RUN apk add --no-cache \
    # Core utilities
    bash \
    curl \
    git \
    supervisor \
    nginx \
    # PHP extensions dependencies
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    # Process management
    shadow

# Install PHP extensions required by Laravel + Filament
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        xml \
        intl \
        opcache

# Install Redis PHP extension (for future cache/queue upgrade)
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

WORKDIR /var/www/html

# Copy PHP configuration
COPY docker/php/php.ini /usr/local/etc/php/conf.d/oscar.ini
COPY docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Copy Nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Copy Supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy application source code
COPY --chown=www-data:www-data . .

# Copy built vendor and public assets from previous stages
COPY --from=composer-builder --chown=www-data:www-data /app/vendor ./vendor
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build ./public/build

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create nginx log directory
RUN mkdir -p /var/log/nginx /var/log/php-fpm /var/run/nginx \
    && chown -R www-data:www-data /var/log/nginx /var/log/php-fpm

# Copy and set entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

#!/bin/bash

# Build script for production with PWA enabled

echo "🚀 Building for production..."

# Clear previous builds
echo "🧹 Clearing previous builds..."
rm -rf public/build
rm -f public/sw.js public/workbox-*.js

# Build assets
echo "📦 Building assets..."
npm run build

# Run Laravel optimizations
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan icons:cache

# Clear and warm up cache
echo "♻️ Warming up cache..."
php artisan cache:clear
php artisan optimize

echo "✅ Production build complete!"
echo ""
echo "📝 Next steps:"
echo "1. Deploy to your server"
echo "2. Run 'php artisan migrate --force' on production"
echo "3. Ensure VAPID keys are set in production .env"
echo "4. Test service worker registration in production"
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css','resources/css/globals.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'prompt',
            injectRegister: 'auto',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'Kwika Events',
                short_name: 'Kwika',
                description: 'Find and book the best event service providers in Malawi',
                theme_color: '#7c3aed',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                categories: ['entertainment', 'events', 'business'],
                icons: [
                    {
                        src: '/android-icon-36x36.png',
                        sizes: '36x36',
                        type: 'image/png'
                    },
                    {
                        src: '/android-icon-48x48.png',
                        sizes: '48x48',
                        type: 'image/png'
                    },
                    {
                        src: '/android-icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png'
                    },
                    {
                        src: '/android-icon-96x96.png',
                        sizes: '96x96',
                        type: 'image/png'
                    },
                    {
                        src: '/android-icon-144x144.png',
                        sizes: '144x144',
                        type: 'image/png'
                    },
                    {
                        src: '/android-icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/android-icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    }
                ],
                screenshots: [
                    {
                        src: '/screenshot-mobile-1.jpg',
                        sizes: '750x1624',
                        type: 'image/jpeg',
                        form_factor: 'narrow',
                        label: 'Browse service providers'
                    },
                    {
                        src: '/screenshot-mobile-2.jpg',
                        sizes: '750x1624',
                        type: 'image/jpeg',
                        form_factor: 'narrow',
                        label: 'Book events easily'
                    },
                    {
                        src: '/screenshot-desktop-1.jpg',
                        sizes: '1920x1080',
                        type: 'image/jpeg',
                        form_factor: 'wide',
                        label: 'Full desktop experience'
                    }
                ]
            },
            workbox: {
                // App Shell Pattern - Cache critical resources
                globPatterns: ['**/*.{js,css,html,woff,woff2,ttf,eot}'],
                navigateFallback: null,
                // Add push notification handlers
                additionalManifestEntries: [
                    { url: '/offline.html', revision: null }
                ],
                // Import custom service worker for push notifications
                importScripts: ['/sw-custom.js'],
                runtimeCaching: [
                    // App Shell - Cache header, footer, navigation (HTML)
                    {
                        urlPattern: /^\/$|\/explore|\/wishlists|\/bookings|\/messages|\/profile/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'app-shell-pages',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    // Static Assets - Long cache
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'images',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    // API Calls - Network first with fallback
                    {
                        urlPattern: /^https?:\/\/[^/]+\/(api|search|providers|services)/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            networkTimeoutSeconds: 5,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 5 // 5 minutes
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    // Google Fonts
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ],
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true
            },
            devOptions: {
                enabled: false, // Disable PWA in development to prevent navigation issues
                type: 'module',
                suppressWarnings: true
            }
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },
});

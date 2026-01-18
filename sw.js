// FishFinder Pro - Service Worker
const CACHE_NAME = 'fishfinder-v1';
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'styles.css',
    'app.js',
    'manifest.json',
    'icons/icon-192.svg',
    'icons/icon-512.svg',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests except for CDNs we use
    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === location.origin;
    const isTrustedCDN = url.hostname.includes('unpkg.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('basemaps.cartocdn.com');

    if (!isSameOrigin && !isTrustedCDN) return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }

                // Fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache if not successful
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Clone the response for caching
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // Offline fallback for HTML pages
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('index.html');
                        }
                    });
            })
    );
});

// Background sync for offline catch logging
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-catches') {
        event.waitUntil(syncCatches());
    }
});

async function syncCatches() {
    // In a real app, this would sync with a backend
    console.log('Syncing catches...');
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};

    const options = {
        body: data.body || 'Time to go fishing!',
        icon: 'icons/icon-192.svg',
        badge: 'icons/icon-192.svg',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || './'
        },
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'FishFinder Pro', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    event.waitUntil(
        clients.openWindow(event.notification.data.url || './')
    );
});

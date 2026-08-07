// ToonVault Service Worker - PWA Offline Support
const CACHE_NAME = 'toonvault-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/toonvault_icon.png',
  '/toonvault_logo_full.png',
  '/cloud_bg.png',
  '/hero_bg.png',
  '/step_icon_choose.png',
  '/step_icon_follow.png',
  '/step_icon_ai.png',
  '/step_icon_vault.png',
  '/chibi_princess.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch(err => console.log('[SW] Cache failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip API requests - always go to network
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/')) return;
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback to index.html for navigation
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background sync for votes/interactions when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-votes') {
    console.log('[SW] Syncing pending votes...');
  }
});

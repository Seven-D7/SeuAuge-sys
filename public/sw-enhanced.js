// Enhanced Service Worker for SeuAuge PWA
const CACHE_NAME = 'seuauge-v1.2.0';
const STATIC_CACHE = 'seuauge-static-v1.2.0';
const DYNAMIC_CACHE = 'seuauge-dynamic-v1.2.0';
const IMAGES_CACHE = 'seuauge-images-v1.2.0';
const API_CACHE = 'seuauge-api-v1.2.0';

// Critical resources that should always be cached
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/styles/accessibility.css',
  // Add your critical CSS and JS bundles here
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/user/profile',
  '/api/achievements',
  '/api/videos',
  '/api/stats',
];

// Images and media to cache
const MEDIA_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm'];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGES_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Handle different types of requests with appropriate strategies
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Check if request is for API
function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('supabase.co') ||
         url.hostname.includes('stripe.com');
}

// Check if request is for images
function isImageRequest(url) {
  return MEDIA_EXTENSIONS.some(ext => url.pathname.includes(ext));
}

// Check if request is for static assets
function isStaticAsset(url) {
  return url.pathname.includes('/src/') ||
         url.pathname.includes('/assets/') ||
         url.pathname.includes('.css') ||
         url.pathname.includes('.js') ||
         url.pathname.includes('.json');
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle API requests - Network first, fallback to cache
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('API request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Dados não disponíveis offline' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle image requests - Cache first, fallback to network
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGES_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the image
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Image request failed:', error);
    
    // Return placeholder image for failed image requests
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#999">
          Imagem não disponível offline
        </text>
      </svg>`,
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// Handle static assets - Cache first, update in background
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Update in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }
  
  try {
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Static asset request failed:', error);
    throw error;
  }
}

// Handle navigation requests - Network first, fallback to offline page
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Navigation request failed, trying cache:', error);
    
    // Try to get cached page
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlineResponse = await cache.match('/');
    return offlineResponse || new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>SeuAuge - Offline</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            margin: 0;
            background: linear-gradient(135deg, #0d9488, #10b981);
            color: white;
            text-align: center;
          }
          .container { max-width: 400px; padding: 2rem; }
          h1 { font-size: 2rem; margin-bottom: 1rem; }
          p { font-size: 1.1rem; line-height: 1.6; }
          button { 
            background: white; 
            color: #0d9488; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 0.5rem; 
            font-size: 1rem; 
            cursor: pointer; 
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏃‍♂️ SeuAuge</h1>
          <p>Você está offline, mas não se preocupe! Algumas funcionalidades ainda estão disponíveis.</p>
          <button onclick="window.location.reload()">Tentar Novamente</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Handle other dynamic requests
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Resource not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync-achievements') {
    event.waitUntil(syncAchievements());
  } else if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Sync achievements when back online
async function syncAchievements() {
  try {
    const pendingAchievements = await getStoredData('pendingAchievements');
    if (pendingAchievements && pendingAchievements.length > 0) {
      for (const achievement of pendingAchievements) {
        await fetch('/api/achievements', {
          method: 'POST',
          body: JSON.stringify(achievement),
          headers: { 'Content-Type': 'application/json' }
        });
      }
      // Clear pending achievements
      await clearStoredData('pendingAchievements');
    }
  } catch (error) {
    console.error('Failed to sync achievements:', error);
  }
}

// Sync progress when back online
async function syncProgress() {
  try {
    const pendingProgress = await getStoredData('pendingProgress');
    if (pendingProgress && pendingProgress.length > 0) {
      for (const progress of pendingProgress) {
        await fetch('/api/progress', {
          method: 'POST',
          body: JSON.stringify(progress),
          headers: { 'Content-Type': 'application/json' }
        });
      }
      // Clear pending progress
      await clearStoredData('pendingProgress');
    }
  } catch (error) {
    console.error('Failed to sync progress:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Nova conquista desbloqueada!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [200, 100, 200],
    data: {},
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/close-icon.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = data;
  }
  
  event.waitUntil(
    self.registration.showNotification('SeuAuge', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to relevant page
    event.waitUntil(
      clients.openWindow('/achievements')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Utility functions for IndexedDB storage
async function getStoredData(key) {
  // Simple localStorage fallback for demo
  // In production, use IndexedDB
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

async function clearStoredData(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

async function syncUserData() {
  // Sync user data in the background
  try {
    await Promise.all([
      syncAchievements(),
      syncProgress()
    ]);
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

console.log('Service Worker: Enhanced SW loaded');

/**
 * ESPINITAS Y FLORES - SERVICE WORKER
 * Advanced Caching Strategy for Performance
 * ======================================
 */

const CACHE_NAME = 'espinitas-y-flores-v1.0.0';
const STATIC_CACHE = 'espinitas-static-v1';
const DYNAMIC_CACHE = 'espinitas-dynamic-v1';

// Critical resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/logo1.png',
    '/logo-texto.png',
    '/img/hero.webp',
    '/img/logo-blanco.webp',
    '/img/servicio-plantas.webp',
    '/img/servicio-online.webp',
    '/img/servicio-delivery.webp',
    '/img/nosotros-historia.webp',
    '/img/nosotros-mision-2.webp',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Gallery images to cache - TODAS las imágenes disponibles
const GALLERY_IMAGES = [
    '/imagenes mejoradas/Gemini_Generated_Image_5tey9v5tey9v5tey.png',
    '/imagenes mejoradas/Gemini_Generated_Image_5vdbtl5vdbtl5vdb.png',
    '/imagenes mejoradas/Gemini_Generated_Image_howgaahowgaahowg.png',
    '/imagenes mejoradas/Gemini_Generated_Image_uxuvdxuxuvdxuxuv.png',
    '/imagenes mejoradas/Gemini_Generated_Image_whvnl5whvnl5whvn.png',
    '/imagenes mejoradas/Gemini_Generated_Image_yq4a0wyq4a0wyq4a.png',
    '/imagenes mejoradas/Gemini_Generated_Image_3ko1og3ko1og3ko1.png',
    '/imagenes mejoradas/Gemini_Generated_Image_3wtfsq3wtfsq3wtf.png',
    '/imagenes mejoradas/Gemini_Generated_Image_gmj19tgmj19tgmj1.png',
    '/imagenes mejoradas/Gemini_Generated_Image_kr2p9rkr2p9rkr2p.png',
    '/imagenes mejoradas/Gemini_Generated_Image_kwxyv1kwxyv1kwxy.png',
    '/imagenes mejoradas/Gemini_Generated_Image_mrtsr7mrtsr7mrts.png',
    '/imagenes mejoradas/Gemini_Generated_Image_t9ps1xt9ps1xt9ps.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching gallery images');
                return cache.addAll(GALLERY_IMAGES);
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else if (url.origin === location.origin) {
        event.respondWith(handlePageRequest(request));
    } else {
        event.respondWith(handleExternalRequest(request));
    }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Image fetch failed:', error);
        return new Response('Image not available', { status: 404 });
    }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        
        return new Response('Content not available offline', { status: 404 });
    }
}

// Handle external requests (fonts, CDN resources)
async function handleExternalRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: External request failed:', error);
        return new Response('Resource not available', { status: 404 });
    }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        // Get pending form data from IndexedDB
        const pendingForms = await getPendingForms();
        
        for (const formData of pendingForms) {
            try {
                await submitContactForm(formData);
                await removePendingForm(formData.id);
            } catch (error) {
                console.log('Service Worker: Form sync failed:', error);
            }
        }
    } catch (error) {
        console.log('Service Worker: Background sync failed:', error);
    }
}

// Utility functions for IndexedDB operations
async function getPendingForms() {
    // Implementation would use IndexedDB to store pending form submissions
    return [];
}

async function submitContactForm(formData) {
    // Implementation would submit form data to server
    return fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function removePendingForm(formId) {
    // Implementation would remove form from IndexedDB
    return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/logo1.png',
            badge: '/logo1.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver más',
                    icon: '/img/hero.webp'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/img/hero.webp'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('Service Worker: Loaded successfully');

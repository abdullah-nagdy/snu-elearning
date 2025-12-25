const CACHE_NAME = 'snu-elearning-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo .png',
  'images/logo.jpg',
  '/images/background.jpg',
  '/pdfs/BMS021 phys 1.pdf',
  '/pdfs/Engineering Chemistry BMS022.pdf',
  '/pdfs/Engineering drawing MEE121.pdf',
  '/pdfs/Mathematics1-BMS011.pdf',
  '/pdfs/mechanics 1 BMS012.pdf',
  '/pdfs/Engineering English.pdf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Service Worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch resources from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

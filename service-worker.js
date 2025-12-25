const CACHE_NAME = 'snu-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.jpg',
  '/images/background.jpg',
  '/pdfs/phys.pdf',
  '/pdfs/Chemistry.pdf',
  '/pdfs/drawing.pdf',
  '/pdfs/Mathematics.pdf',
  '/pdfs/mechanics.pdf',
  '/pdfs/English.pdf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)));
    })
  );
});

self.addEventListener('fetch', event=>{
  event.respondWith(
    caches.match(event.request).then(response=>{
      return response || fetch(event.request).catch(()=>caches.match('/index.html'));
    })
  );
});

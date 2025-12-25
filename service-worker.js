const CACHE_NAME = 'snu-elearning-cache-v1';
const urlsToCache = [
  '/', // index.html
  '/index.html',
  '/images/logo.png',
  '/images/logo.jpg',
  '/background.jpg',
  // ملفات PDF
  '/pdfs/phys.pdf',
  '/pdfs/Chemistry.pdf',
  '/pdfs/drawing.pdf',
  '/pdfs/Mathematics.pdf',
  '/pdfs/mechanics.pdf',
  '/pdfs/English.pdf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// تثبيت Service Worker والكاش مع عداد مئوي
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      let loaded = 0;
      for (const url of urlsToCache) {
        try {
          const request = new Request(url, { cache: 'reload' });
          const response = await fetch(request);
          await cache.put(request, response.clone());
          loaded++;
          // أرسل نسبة التحميل للصفحة
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'CACHE_PROGRESS',
                progress: Math.round((loaded / urlsToCache.length) * 100)
              });
            });
          });
        } catch (err) {
          console.error('Failed to cache:', url, err);
        }
      }
    })()
  );
  self.skipWaiting();
});

// تفعيل Service Worker وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التقاط الطلبات والرد من الكاش إذا موجود أو تحميل جديد وتخزينه
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }))
      .catch(() => new Response('<h2>أنت الآن بدون إنترنت</h2>', {
        headers: { 'Content-Type': 'text/html' }
      }))
  );
});

const CACHE_NAME = 'snu-elearning-cache-v1';
const urlsToCache = [
  '/', // صفحة index.html
  '/index.html',
  , // لو عندك CSS خارجي
  '/images/logo.png',
  '/images/logo.jpg',
  '/background.jpg',
  // كل ملفات PDF موجودة عندك في مجلد pdfs
  '/pdfs/phys.pdf',
  '/pdfs/Chemistry.pdf',
  '/pdfs/drawing.pdf',
  '/pdfs/Mathematics.pdf',
  '/pdfs/mechanics.pdf',
  '/pdfs/English.pdf',
  // Font Awesome
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// تثبيت الـ Service Worker والكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
      })
      .catch((err) => console.error('Cache failed: ', err))
  );
});

// تفعيل الـ Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if(cacheName !== CACHE_NAME){
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// التقاط الطلبات وإرجاع الملفات من الكاش إذا متوفرة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => {
        // ممكن تحط صفحة offline.html هنا لو حابب
        return new Response('أنت الآن بدون إنترنت');
      })
  );
});

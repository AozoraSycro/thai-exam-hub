const CACHE_NAME = 'thai-exam-hub-v1';
const ASSETS = [
  './',
  './index.html',
  './subject.html',
  './quiz.html',
  './results.html',
  './css/style.css',
  './js/app.js',
  './js/quiz.js',
  './js/storage.js',
  './data/subjects.json',
  './data/summaries.json',
  './data/onet_math_2566.json',
  './data/onet_math_2567.json',
  './data/onet_science_2566.json',
  './data/pat1_2566.json',
  './data/tgat_english_2567.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Don't cache everything, just maybe newer data files if encountered
          if (event.request.url.includes('/data/')) {
            cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      if (event.request.url.indexOf('.html') > -1) {
        return caches.match('./index.html');
      }
    })
  );
});

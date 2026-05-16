/**
 * sw.js - Service Worker for Thai Exam Hub
 * Handles offline caching for HTML, CSS, JS, and JSON data.
 */

const CACHE_NAME = 'teh-v1';
const ASSETS = [
    './',
    './index.html',
    './subject.html',
    './quiz.html',
    './results.html',
    './study.html',
    './privacy.html',
    './about.html',
    './css/style.css',
    './js/app.js',
    './js/quiz.js',
    './js/storage.js',
    './data/subjects.json',
    './data/summaries.json'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchRes) => {
                // Optionally cache new data files on the fly
                if (event.request.url.includes('/data/')) {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request.url, fetchRes.clone());
                        return fetchRes;
                    });
                }
                return fetchRes;
            });
        }).catch(() => {
            // Fallback for offline if not in cache
            if (event.request.url.indexOf('.html') > -1) {
                return caches.match('./index.html');
            }
        })
    );
});

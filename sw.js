fetch('/courses').then(
  function (response) {
    response.json().then(
      function (text) {
        self.importScripts(text);
        console.log(text);
      }
    )
  }
)

// Files to cache
var cacheName = 'js13kPWA-v1';
var appShellFiles = [
  '/index.html',
  '/app.js',
  '/style.css',

];
var courseImages = [];
for(var i=0; i<games.length; i++) {
  courseImages.push('img/'+courses[i].school+'.jpg');
}
var contentToCache = appShellFiles.concat(courseImages);

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

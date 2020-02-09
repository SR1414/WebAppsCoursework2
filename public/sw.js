self.importScripts('data/games.js');

var cacheName = 'js13kPWA-v1';
var appShellFiles = [
    '/pwa/js13kPWA/',
    '/pwa/js13kPWA/app.js',
    '/pwa/js13kPWA/index.html',
    '/pwa/js13kPWA/style.css',
    '/pwa/js13kPWA/img',
];

var gamesImages = [];
for (var i = 0; i < games.length; i++){
    gamesImages.push('data/img/' + games[i].slug + '.jpg');
}
var contentToCache = appShellFiles.concat(gamesImages);
//installing servicer worker
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    )
})
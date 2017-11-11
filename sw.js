var CACHE_NAME = 'pwa-cache-v__TIMESTAMP__';

self.addEventListener('activate', event => {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log(`Deleting cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      fetch('assets-manifest.json', {headers: {'Content-Type': 'application/json'}})
        .then(res => res.json())
        .then(assets => cache.addAll(assets))
        .then(() => console.log('Cached'))
    )
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

const CACHE_NAME = 'pwa-cache-v1'

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log(`Deleting cache: ${key}`)
            return caches.delete(key)
          }
        }))
      )
  )
})

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => fetch('asset-manifest.json')
        .then(res => res.json())
        .then(assets => cache.addAll(assets))
        .then(() => console.log('cached'))
      )
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)))
})
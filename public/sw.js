// Service Worker for Silph Pocket Dex (AYN Thor offline-first cache)
const CACHE_NAME = 'silph-dex-cache-v1'

const ASSETS_TO_CACHE = [
  '/',
  '/icon.svg',
  '/icon-dark-32x32.png',
  '/icon-light-32x32.png',
  '/apple-icon.png',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {})
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Handle Pokemon sprites and icons (Showdown & PokeAPI) with Cache-First strategy
  if (
    url.hostname.includes('pokemonshowdown.com') ||
    url.hostname.includes('raw.githubusercontent.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) return cached

        try {
          const networkResponse = await fetch(event.request)
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone())
          }
          return networkResponse
        } catch (error) {
          // If offline and not in cache, return an empty 204 or propagate error so client fallback triggers
          return new Response(null, { status: 404, statusText: 'Offline not in cache' })
        }
      })
    )
    return
  }

  // Handle Next.js static assets and document with Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.method === 'GET'
          ) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})

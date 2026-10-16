// Service Worker for PokeThor Assistant (AYN Thor offline-first cache)
const CACHE_NAME = 'pokethor-cache-v1'

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

// Handle bulk pre-cache requests from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'precacheSprites') {
    const urls = event.data.urls || []
    const clientId = event.source ? event.source.id : null

    precacheBatch(urls, clientId).catch(() => {})
  }
})

async function precacheBatch(urls, clientId) {
  const cache = await caches.open(CACHE_NAME)
  const BATCH_SIZE = 12
  let cached = 0
  let skipped = 0
  const total = urls.length

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const promises = batch.map(async (url) => {
      try {
        const existing = await cache.match(url)
        if (existing) {
          skipped++
          return
        }
        const response = await fetch(url, { mode: 'cors' })
        if (response && response.status === 200) {
          await cache.put(url, response)
          cached++
        }
      } catch (_) {
        // Skip failed fetches silently
      }
    })
    await Promise.all(promises)

    // Report progress back to the client
    if (clientId) {
      const client = await self.clients.get(clientId)
      if (client) {
        client.postMessage({
          type: 'precacheProgress',
          cached,
          skipped,
          total,
          done: (cached + skipped) >= total || (i + BATCH_SIZE) >= total,
        })
      }
    }
  }

  // Final done message
  if (clientId) {
    const client = await self.clients.get(clientId)
    if (client) {
      client.postMessage({
        type: 'precacheProgress',
        cached,
        skipped,
        total,
        done: true,
      })
    }
  }
}

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

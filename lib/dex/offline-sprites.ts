import { useState, useEffect } from 'react'
import { boxIconUrl, POKEDEX } from './pokemon'

export type OfflineStatus = 'idle' | 'checking' | 'downloading' | 'paused' | 'done' | 'error'

export type OfflineProgress = {
  status: OfflineStatus
  cached: number
  total: number
  currentName?: string
  error?: string
}

const CACHE_NAME = 'pokethor-cache-v1'

// Singleton module state — survives tab / view unmounts
let progressState: OfflineProgress = {
  status: 'idle',
  cached: 0,
  total: POKEDEX.length,
}

const listeners = new Set<() => void>()
let abortController: AbortController | null = null
let hasCheckedInitial = false

function emit() {
  listeners.forEach((fn) => {
    try {
      fn()
    } catch (_) {
      // Ignore listener error
    }
  })
}

export function getOfflineProgress(): OfflineProgress {
  return progressState
}

export function subscribeOfflineProgress(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Checks existing cached sprites count in CacheStorage.
 */
export async function checkCacheStatus(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return
  if (progressState.status === 'downloading') return

  progressState = { ...progressState, status: 'checking', error: undefined }
  emit()

  try {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()
    const cachedUrls = new Set(keys.map((k) => k.url))

    let found = 0
    for (const p of POKEDEX) {
      if (cachedUrls.has(boxIconUrl(p.iconId))) {
        found++
      }
    }

    hasCheckedInitial = true
    progressState = {
      status: found >= POKEDEX.length ? 'done' : 'idle',
      cached: found,
      total: POKEDEX.length,
      currentName: undefined,
      error: undefined,
    }
  } catch (err: any) {
    progressState = {
      ...progressState,
      status: 'idle',
      error: 'No se pudo verificar la caché local.',
    }
  }
  emit()
}

/**
 * Starts or resumes downloading missing sprites concurrently in the background.
 */
export async function startOfflineDownload(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    progressState = {
      ...progressState,
      status: 'error',
      error: 'Cache API no soportada en este entorno.',
    }
    emit()
    return
  }

  if (progressState.status === 'downloading') return

  abortController = new AbortController()
  const signal = abortController.signal

  progressState = {
    ...progressState,
    status: 'downloading',
    error: undefined,
  }
  emit()

  try {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()
    const cachedUrls = new Set(keys.map((k) => k.url))

    let cachedCount = 0
    for (const p of POKEDEX) {
      if (cachedUrls.has(boxIconUrl(p.iconId))) {
        cachedCount++
      }
    }

    progressState = {
      ...progressState,
      cached: cachedCount,
      total: POKEDEX.length,
      status: 'downloading',
    }
    emit()

    const missing = POKEDEX.filter((p) => !cachedUrls.has(boxIconUrl(p.iconId)))

    if (missing.length === 0) {
      progressState = {
        status: 'done',
        cached: POKEDEX.length,
        total: POKEDEX.length,
        currentName: undefined,
      }
      emit()
      return
    }

    const CONCURRENCY = 8
    let nextIdx = 0

    const worker = async () => {
      while (nextIdx < missing.length && !signal.aborted) {
        const item = missing[nextIdx++]
        if (!item) break
        const url = boxIconUrl(item.iconId)

        try {
          const res = await fetch(url, { signal, mode: 'cors' })
          if (res.ok) {
            await cache.put(url, res.clone())
            cachedCount++
            cachedUrls.add(url)
            progressState = {
              status: 'downloading',
              cached: cachedCount,
              total: POKEDEX.length,
              currentName: `${item.name} (#${item.dex})`,
            }
            emit()
          }
        } catch (_) {
          if (signal.aborted) break
          // If individual fetch fails (e.g. transient timeout), keep going
        }
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, () => worker())
    await Promise.all(workers)

    if (signal.aborted) {
      progressState = {
        ...progressState,
        status: 'paused',
        currentName: undefined,
      }
    } else {
      const isComplete = cachedCount >= POKEDEX.length
      progressState = {
        status: isComplete ? 'done' : 'idle',
        cached: cachedCount,
        total: POKEDEX.length,
        currentName: undefined,
      }
    }
  } catch (err: any) {
    if (!signal.aborted) {
      progressState = {
        ...progressState,
        status: 'error',
        error: err?.message || 'Error durante la descarga.',
      }
    }
  }

  abortController = null
  emit()
}

/**
 * Pauses background sprite download.
 */
export function pauseOfflineDownload(): void {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  progressState = {
    ...progressState,
    status: 'paused',
    currentName: undefined,
  }
  emit()
}

/**
 * React hook to observe and control offline sprites.
 */
export function useOfflineSprites() {
  const [state, setState] = useState<OfflineProgress>(getOfflineProgress)

  useEffect(() => {
    if (!hasCheckedInitial && progressState.status === 'idle') {
      checkCacheStatus()
    }
    const unsub = subscribeOfflineProgress(() => {
      setState({ ...getOfflineProgress() })
    })
    return unsub
  }, [])

  return {
    ...state,
    start: startOfflineDownload,
    pause: pauseOfflineDownload,
    check: checkCacheStatus,
  }
}

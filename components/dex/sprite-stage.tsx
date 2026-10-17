'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { aniSpriteUrl, boxIconUrl } from '@/lib/dex/pokemon'
import { cn } from '@/lib/utils'

type TrimmedSprite = {
  url: string
  width: number
  height: number
}

// Cache in memory so each static sprite is trimmed at most once per session
const trimCache = new Map<string, TrimmedSprite>()

/**
 * Removes transparent padding around static 96x96 / 120x120 PNG sprites
 * so they sit flush on the pedestal and scale by their true visual size.
 */
function trimTransparentSprite(url: string): Promise<TrimmedSprite | null> {
  const cached = trimCache.get(url)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const w = img.naturalWidth
        const h = img.naturalHeight
        if (!w || !h) {
          resolve(null)
          return
        }

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) {
          resolve(null)
          return
        }

        ctx.drawImage(img, 0, 0)
        const { data } = ctx.getImageData(0, 0, w, h)

        let minX = w
        let minY = h
        let maxX = -1
        let maxY = -1

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const alpha = data[(y * w + x) * 4 + 3]
            if (alpha > 12) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
            }
          }
        }

        if (maxX < minX || maxY < minY) {
          resolve(null)
          return
        }

        const trimW = maxX - minX + 1
        const trimH = maxY - minY + 1

        // If already tightly cropped, keep original
        if (trimW >= w - 4 && trimH >= h - 4) {
          const result = { url, width: w, height: h }
          trimCache.set(url, result)
          resolve(result)
          return
        }

        const out = document.createElement('canvas')
        out.width = trimW
        out.height = trimH
        const outCtx = out.getContext('2d')
        if (!outCtx) {
          resolve(null)
          return
        }

        outCtx.drawImage(canvas, minX, minY, trimW, trimH, 0, 0, trimW, trimH)
        const result: TrimmedSprite = {
          url: out.toDataURL('image/png'),
          width: trimW,
          height: trimH,
        }
        trimCache.set(url, result)
        resolve(result)
      } catch {
        // CORS-restricted image; cannot read pixels via canvas
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export function SpriteStage({
  slug,
  name,
  dex,
  className,
  size = 'lg',
  dim = false,
}: {
  slug: string
  name: string
  dex?: number
  className?: string
  size?: 'lg' | 'sm'
  dim?: boolean
  zoom?: number
}) {
  const lg = size === 'lg'
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [attempt, setAttempt] = useState(0)
  const [stageBounds, setStageBounds] = useState<{ w: number; h: number }>({
    w: lg ? 160 : 64,
    h: lg ? 96 : 48,
  })
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number; isPaddedFallback: boolean } | null>(null)
  const [trimmedOverride, setTrimmedOverride] = useState<TrimmedSprite | null>(null)

  // Candidate URLs in priority order:
  // 0: Showdown animated GIF (tightly cropped)
  // 1: PokeAPI sprite (CORS-enabled & offline-cached, auto-trimmed by canvas)
  // 2: Showdown Gen 5 static PNG (fallback for special named forms)
  const isSpecialForm = slug.includes('-')
  const candidateUrl =
    attempt === 0
      ? aniSpriteUrl(slug)
      : attempt === 1
        ? !isSpecialForm && dex
          ? boxIconUrl(dex)
          : `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`
        : attempt === 2
          ? isSpecialForm && dex
            ? boxIconUrl(dex)
            : `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`
          : null

  // Reset state when Pokemon changes
  useEffect(() => {
    setAttempt(0)
    setNaturalSize(null)
    setTrimmedOverride(null)
  }, [slug, dex])

  // Observe real DOM container dimensions so sprites never overflow or clip
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const updateBounds = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setStageBounds((prev) =>
          Math.abs(prev.w - rect.width) > 0.5 || Math.abs(prev.h - rect.height) > 0.5
            ? { w: rect.width, h: rect.height }
            : prev,
        )
      }
    }

    updateBounds()
    const observer = new ResizeObserver(updateBounds)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleImageLoad = useCallback(
    async (img: HTMLImageElement) => {
      const nw = img.naturalWidth
      const nh = img.naturalHeight
      if (!nw || !nh) return

      const currentSrc = candidateUrl ?? img.src
      const isStaticFallback = attempt > 0 || currentSrc.endsWith('.png')

      if (isStaticFallback && !trimmedOverride) {
        const trimmed = await trimTransparentSprite(currentSrc)
        if (trimmed) {
          setTrimmedOverride(trimmed)
          setNaturalSize({ w: trimmed.width, h: trimmed.height, isPaddedFallback: false })
          return
        }
      }

      // Detect untrimmed 96x96 or 120x120 fixed-canvas sprites when CORS blocks canvas
      const isUntrimmedSquareCanvas =
        !trimmedOverride && isStaticFallback && ((nw === 96 && nh === 96) || (nw === 120 && nh === 120))

      setNaturalSize({
        w: nw,
        h: nh,
        isPaddedFallback: isUntrimmedSquareCanvas,
      })
    },
    [attempt, candidateUrl, trimmedOverride],
  )

  // Check if cached image already completed loading on mount
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0 && !naturalSize) {
      handleImageLoad(img)
    }
  }, [candidateUrl, naturalSize, handleImageLoad])

  const handleError = () => {
    setTrimmedOverride(null)
    setNaturalSize(null)
    setAttempt((prev) => prev + 1)
  }

  // Compute exact pixel dimensions to render
  const renderedDims = (() => {
    if (!naturalSize) return null
    const { w: nw, h: nh, isPaddedFallback } = naturalSize

    // Reserve safe clearance for idle bounce at top & pedestal at bottom
    const padY = lg ? 14 : 6
    const padX = lg ? 14 : 6
    const availH = Math.max(lg ? 44 : 22, stageBounds.h - padY)
    const availW = Math.max(lg ? 60 : 28, stageBounds.w - padX)

    // If an untrimmed 96x96 non-CORS sprite loaded, fit to container height
    if (isPaddedFallback) {
      const scale = Math.min((availH * 1.08) / nh, (availW * 1.08) / nw)
      return {
        width: Math.round(nw * scale),
        height: Math.round(nh * scale),
      }
    }

    // Proportional fill curve based on the Pokemon's natural tight bounding box:
    // Small Pokemon (~28-45px) fill ~62-72% of stage height (clear & visible, never giant).
    // Medium Pokemon (~55-80px) fill ~76-86% of stage height.
    // Large Pokemon (90px+) fill up to 95% of stage height/width without clipping.
    const refDim = Math.max(nw, nh)
    const t = Math.max(0, Math.min(1, (refDim - 26) / (105 - 26)))
    const fillRatio = lg ? 0.62 + t * 0.33 : 0.75 + t * 0.2

    const targetH = availH * fillRatio
    const targetW = availW * fillRatio

    const scaleH = targetH / nh
    const scaleW = targetW / nw
    const maxPixelUpscale = lg ? 2.15 : 1.5

    // Strictly clamp to never exceed availH or availW
    const hardLimitH = availH / nh
    const hardLimitW = availW / nw

    const scale = Math.min(scaleH, scaleW, maxPixelUpscale, hardLimitH, hardLimitW)

    return {
      width: Math.max(1, Math.round(nw * scale)),
      height: Math.max(1, Math.round(nh * scale)),
    }
  })()

  const activeSrc = trimmedOverride ? trimmedOverride.url : candidateUrl

  return (
    <div
      ref={stageRef}
      className={cn(
        'relative flex items-end justify-center overflow-hidden',
        lg ? 'h-full min-h-[4.5rem] w-full' : 'h-14 w-16',
        className,
      )}
    >
      {/* Holographic pedestal */}
      <div
        aria-hidden
        className={cn('animate-holo absolute bottom-0.5 rounded-[50%] border', lg ? 'h-5 w-32' : 'h-3 w-14')}
        style={{
          borderColor: 'color-mix(in srgb, var(--led) 70%, transparent)',
          background:
            'radial-gradient(ellipse at center, color-mix(in srgb, var(--led) 55%, transparent) 0%, color-mix(in srgb, var(--led) 12%, transparent) 55%, transparent 72%)',
        }}
      />
      {lg ? (
        <div
          aria-hidden
          className="absolute bottom-1.5 h-2.5 w-20 rounded-[50%] border border-dashed"
          style={{ borderColor: 'color-mix(in srgb, var(--led) 50%, transparent)' }}
        />
      ) : null}

      <div className="relative z-10 flex items-end justify-center pb-1.5">
        {activeSrc ? (
          <img
            ref={imgRef}
            key={`${slug}-${attempt}-${Boolean(trimmedOverride)}`}
            src={activeSrc}
            alt={name}
            onLoad={(e) => handleImageLoad(e.currentTarget)}
            onError={handleError}
            draggable={false}
            style={
              renderedDims
                ? {
                  width: `${renderedDims.width}px`,
                  height: `${renderedDims.height}px`,
                }
                : undefined
            }
            className={cn(
              'pixelated relative block max-w-none max-h-none select-none object-contain object-bottom transition-opacity duration-75',
              lg && 'animate-idle',
              renderedDims ? 'opacity-100' : 'opacity-0',
              dim && 'opacity-45 grayscale',
            )}
          />
        ) : (
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded border border-white/20 bg-black/60 p-2 font-mono text-center',
              lg ? 'mb-1 size-16' : 'size-10',
            )}
            style={{ borderColor: 'var(--led)' }}
          >
            <span className="font-mono text-2xs font-extrabold text-white/90">#{dex ?? '???'}</span>
            <span className="truncate font-mono text-3xs text-white/50">{name}</span>
          </div>
        )}
      </div>
    </div>
  )
}
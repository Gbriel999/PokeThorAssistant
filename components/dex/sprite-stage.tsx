'use client'

import { useState, useEffect } from 'react'
import { aniSpriteUrl, boxIconUrl } from '@/lib/dex/pokemon'
import { cn } from '@/lib/utils'

export function SpriteStage({
  slug,
  name,
  dex,
  className,
  size = 'lg',
  dim = false,
  zoom = 1,
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
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setAttempt(0)
  }, [slug])

  // Candidate image URLs in fallback order:
  // 0: Animated Showdown GIF
  // 1: Static Showdown Gen 5 PNG
  // 2: PokeAPI regular sprite
  const candidateUrl =
    attempt === 0
      ? aniSpriteUrl(slug)
      : attempt === 1
        ? `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`
        : dex
          ? boxIconUrl(dex)
          : null

  const handleError = () => {
    setAttempt((prev) => prev + 1)
  }

  return (
    <div className={cn('relative flex items-end justify-center', lg ? 'h-[7.5rem]' : 'h-16', className)}>
      <div
        aria-hidden
        className={cn('animate-holo absolute bottom-0 rounded-[50%] border', lg ? 'h-6 w-36' : 'h-3.5 w-16')}
        style={{
          borderColor: 'color-mix(in srgb, var(--led) 70%, transparent)',
          background:
            'radial-gradient(ellipse at center, color-mix(in srgb, var(--led) 55%, transparent) 0%, color-mix(in srgb, var(--led) 12%, transparent) 55%, transparent 72%)',
        }}
      />
      {lg ? (
        <div
          aria-hidden
          className="absolute bottom-1.5 h-3 w-24 rounded-[50%] border border-dashed"
          style={{ borderColor: 'color-mix(in srgb, var(--led) 50%, transparent)' }}
        />
      ) : null}
      <div className={cn('relative origin-bottom', lg && zoom > 1 && 'mb-1')} style={{ transform: zoom > 1 ? `scale(${zoom})` : undefined }}>
        {candidateUrl ? (
          <img
            key={`${slug}-${attempt}`}
            src={candidateUrl}
            alt={name}
            onError={handleError}
            draggable={false}
            className={cn(
              'pixelated relative object-contain object-bottom',
              lg ? 'animate-idle mb-2 max-h-[7rem] max-w-[10rem]' : 'mb-1 max-h-14 max-w-20',
              dim && 'opacity-45 grayscale',
            )}
          />
        ) : (
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded border border-white/20 bg-black/60 p-2 font-mono text-center',
              lg ? 'mb-2 size-20' : 'mb-1 size-12',
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

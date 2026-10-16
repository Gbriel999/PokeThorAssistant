'use client'

import { ChevronDown, Delete, Keyboard, Search, X } from 'lucide-react'
import { useState } from 'react'
import { typesFor } from '@/lib/dex/analysis'
import { GENERATION_INSIGNIAS, getGenForDexNumber } from '@/lib/dex/calc'
import type { Game } from '@/lib/dex/games'
import { boxIconUrl, POKEDEX } from '@/lib/dex/pokemon'
import { typesForGen, type PokeType } from '@/lib/dex/types'
import { cn } from '@/lib/utils'
import { TypeIcon } from './type-badge'

/* 6-column ABC layout: wider keys, much easier to tap on the Thor screen */
const ROWS = ['ABCDEF', 'GHIJKL', 'MNOPQR', 'STUVWX', 'YZ-']

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

export function SearchDrawer({
  open,
  title = 'DEX LOCAL',
  game,
  pcKeys = [],
  onClose,
  onPick,
  onTogglePc,
}: {
  open: boolean
  title?: string
  game: Game
  pcKeys?: string[]
  onClose: () => void
  onPick: (key: string) => void
  onTogglePc?: (key: string) => void
}) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<PokeType | null>(null)
  const [genFilter, setGenFilter] = useState<number | null>(null)
  const [onlyPc, setOnlyPc] = useState(false)
  const [displayLimit, setDisplayLimit] = useState(60)
  const [showKeyboard, setShowKeyboard] = useState(false)

  const isRivalSearch = title.includes('RIVAL')

  const results = POKEDEX.filter(
    (p) =>
      normalize(p.name).includes(query) &&
      (typeFilter === null || typesFor(p, game.gen).includes(typeFilter)) &&
      (genFilter === null || getGenForDexNumber(p.dex) === genFilter) &&
      (!onlyPc || pcKeys.includes(p.key)),
  )

  const reset = () => {
    setQuery('')
    setTypeFilter(null)
    setGenFilter(null)
    setOnlyPc(false)
    setDisplayLimit(60)
  }

  const handlePick = (key: string) => {
    setShowKeyboard(false)
    onPick(key)
  }

  return (
    <>
      <div
        aria-hidden
        onClick={() => {
          setShowKeyboard(false)
          onClose()
        }}
        className={cn(
          'absolute inset-0 z-20 bg-black/70 transition-opacity duration-150 ease-snap',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
        className={cn(
          'absolute inset-y-0 right-0 z-30 flex w-[25rem] flex-col gap-1.5 border-l-2 border-black bg-shell-2 p-2 transition-transform duration-150 ease-snap will-change-transform min-w-0 overflow-hidden',
          open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none',
        )}
      >
        {/* Header bar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              'font-mono text-2xs font-black tracking-[0.15em] shrink-0',
              isRivalSearch ? 'text-[#FF5555]' : 'text-(--acc)'
            )}
          >
            {title}
          </span>
          <button
            type="button"
            onClick={() => {
              setDisplayLimit(60)
              setOnlyPc((v) => !v)
            }}
            aria-pressed={onlyPc}
            className={cn(
              'press chamfer-sm px-1.5 h-8 font-mono text-3xs font-extrabold uppercase transition-colors shrink-0',
              onlyPc ? 'bg-(--acc) text-black' : 'bg-black/60 text-white/50 border border-white/10',
            )}
          >
            {onlyPc ? `✓ PC (${pcKeys.length})` : `PC (${pcKeys.length})`}
          </button>

          {/* Search box: tap to toggle keyboard */}
          <div
            onClick={() => setShowKeyboard((v) => !v)}
            className="chamfer-sm scanlines flex h-9 flex-1 cursor-pointer items-center gap-1.5 bg-black px-2 font-mono text-sm font-bold tracking-[0.15em] text-[#7dffa8] border border-white/10 hover:border-[#7dffa8]/50 min-w-0"
            title="Toca para abrir/cerrar el teclado"
          >
            <Search className="size-3.5 shrink-0 text-[#7dffa8]/60" />
            <span className="truncate flex-1 min-w-0">
              {query || <span className="text-[#7dffa8]/30">BUSCAR...</span>}
            </span>
            {showKeyboard && <span aria-hidden className="animate-caret h-3.5 w-1.5 bg-[#7dffa8] shrink-0" />}
            <span className="text-3xs tracking-normal text-[#7dffa8]/60 shrink-0">
              {results.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowKeyboard((v) => !v)
              }}
              className={cn(
                'press flex size-6 shrink-0 items-center justify-center rounded-[2px] transition-colors',
                showKeyboard ? 'bg-(--acc) text-black font-black' : 'bg-white/15 text-white/70 hover:text-white',
              )}
              title={showKeyboard ? 'Ocultar teclado' : 'Abrir teclado'}
            >
              <Keyboard className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowKeyboard(false)
              onClose()
            }}
            aria-label="Cerrar buscador"
            className="press chamfer-sm grid h-9 w-10 shrink-0 place-items-center border-t border-t-white/10 bg-[#3a1418] text-[#ff8a80]"
          >
            <X className="size-5" strokeWidth={3} aria-hidden />
          </button>
        </div>

        {/* Gen Filter Chips */}
        <div role="group" aria-label="Filtrar por generación" className="grid grid-cols-9 gap-1 shrink-0">
          {GENERATION_INSIGNIAS.map((insignia) => {
            const active = genFilter === insignia.gen
            return (
              <button
                key={insignia.gen}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setDisplayLimit(60)
                  setGenFilter(active ? null : insignia.gen)
                }}
                className={cn(
                  'press chamfer-sm flex h-8 flex-col items-center justify-center p-0.5 border-t transition-colors',
                  active
                    ? 'border-t-white/40 bg-(--acc) text-black'
                    : 'border-t-white/10 bg-[#1c1e24] text-white/70 hover:bg-[#252830]',
                  genFilter && !active && 'opacity-40',
                )}
              >
                <img
                  src={boxIconUrl(insignia.dexNumber)}
                  alt=""
                  draggable={false}
                  className="pixelated size-4 shrink-0 object-contain"
                />
                <span className="font-mono text-[0.5rem] font-extrabold leading-none">{insignia.label}</span>
              </button>
            )
          })}
        </div>

        {/* Type Filter Chips */}
        <div role="group" aria-label="Filtrar por tipo" className="grid grid-cols-9 gap-1 shrink-0">
          {typesForGen(game.gen).map((t) => {
            const active = typeFilter === t
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setDisplayLimit(60)
                  setTypeFilter(active ? null : t)
                }}
                className={cn(
                  'grid h-8 place-items-center rounded-sm transition-transform duration-150 ease-snap active:scale-90',
                  active ? 'bg-white/90' : 'bg-black/50',
                  typeFilter && !active && 'opacity-40',
                )}
              >
                <TypeIcon type={t} className="size-5" />
              </button>
            )
          })}
        </div>

        {/* Pokemon Results Grid - Expands to full height when keyboard is closed */}
        <ul
          onScroll={(e) => {
            const el = e.currentTarget
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
              setDisplayLimit((prev) => Math.min(prev + 60, results.length))
            }
          }}
          className="grid min-h-0 flex-1 grid-cols-4 content-start gap-1 overflow-y-auto pr-0.5"
        >
          {results.slice(0, displayLimit).map((p) => {
            const inPc = pcKeys.includes(p.key)
            return (
              <li key={p.key}>
                <button
                  type="button"
                  onClick={() => handlePick(p.key)}
                  className="press chamfer-sm relative flex h-[3.25rem] w-full flex-col items-center justify-center border-t border-t-white/10 bg-[#22242c]"
                >
                  {inPc ? (
                    <span className="absolute top-1 right-1 font-mono text-[0.4375rem] font-extrabold px-1 leading-3 bg-(--acc) text-black rounded-[2px]">
                      PC
                    </span>
                  ) : null}
                  <img
                    src={boxIconUrl(p.iconId)}
                    alt={p.name}
                    loading="lazy"
                    draggable={false}
                    className="pixelated h-[1.875rem] w-10 object-contain"
                  />
                  <span className="flex items-center gap-1 text-2xs font-bold uppercase leading-none text-white/85 truncate max-w-full px-1">
                    {p.name}
                  </span>
                </button>
              </li>
            )
          })}
          {displayLimit < results.length ? (
            <li className="col-span-4 flex items-center justify-center py-1">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => Math.min(prev + 120, results.length))}
                className="press chamfer-sm h-8 w-full border border-white/15 bg-black/60 font-mono text-3xs font-extrabold text-[#7dffa8] hover:bg-black/90"
              >
                MOSTRAR MÁS ({results.length - displayLimit} restantes)
              </button>
            </li>
          ) : null}
          {results.length === 0 ? (
            <li className="col-span-4 flex h-32 flex-col items-center justify-center font-mono text-xs text-white/40">
              SIN COINCIDENCIAS
            </li>
          ) : null}
        </ul>

        {/* On-demand Virtual Keyboard - ONLY visible when user clicks the search box */}
        {showKeyboard ? (
          <div role="group" aria-label="Teclado" className="flex flex-col gap-1 border-t border-white/10 pt-1 shrink-0 animate-view">
            <div className="flex items-center justify-between pb-0.5 px-0.5 font-mono text-3xs">
              <span className="text-white/40 font-bold">TECLADO VIRTUAL</span>
              <button
                type="button"
                onClick={() => setShowKeyboard(false)}
                className="press flex items-center gap-1 text-(--acc) font-bold"
              >
                <ChevronDown className="size-3.5" />
                <span>OCULTAR TECLADO</span>
              </button>
            </div>

            {ROWS.map((row) => (
              <div key={row} className="grid grid-cols-6 gap-1">
                {row.split('').map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      setDisplayLimit(60)
                      setQuery((q) => (q.length < 12 ? q + ch : q))
                    }}
                    className="press h-10 rounded-sm border-t border-t-white/10 bg-[#2a2c35] font-mono text-base font-bold text-white active:bg-(--acc) active:text-black"
                  >
                    {ch}
                  </button>
                ))}
              </div>
            ))}
            <div className="grid grid-cols-6 gap-1">
              <button
                type="button"
                onClick={reset}
                className="press col-span-2 h-10 rounded-sm border-t border-t-white/10 bg-[#2a2c35] font-mono text-2xs font-bold tracking-widest text-white/70"
              >
                LIMPIAR
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisplayLimit(60)
                  setQuery((q) => q.slice(0, -1))
                }}
                aria-label="Borrar letra"
                className="press col-span-2 grid h-10 place-items-center rounded-sm border-t border-t-white/10 bg-[#2a2c35] text-white/80"
              >
                <Delete className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                disabled={results.length === 0}
                onClick={() => results[0] && handlePick(results[0].key)}
                className="press col-span-2 h-10 rounded-sm border-t border-t-white/40 bg-(--acc) font-mono text-2xs font-extrabold tracking-widest text-black disabled:opacity-40"
              >
                OK · 1º
              </button>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}

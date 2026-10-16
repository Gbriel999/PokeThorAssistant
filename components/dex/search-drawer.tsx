'use client'

import { Delete, X } from 'lucide-react'
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
  game,
  pcKeys = [],
  onClose,
  onPick,
  onTogglePc,
}: {
  open: boolean
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

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'absolute inset-0 z-20 bg-black/70 transition-opacity duration-150 ease-snap',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Buscar Pokémon"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'absolute inset-y-0 right-0 z-30 flex w-[24.5rem] flex-col gap-1.5 border-l-2 border-black bg-shell-2 p-2 transition-transform duration-150 ease-snap will-change-transform',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-2xs font-extrabold tracking-[0.2em] text-(--acc)">DEX LOCAL</span>
          <button
            type="button"
            onClick={() => {
              setDisplayLimit(60)
              setOnlyPc((v) => !v)
            }}
            aria-pressed={onlyPc}
            className={cn(
              'press chamfer-sm px-1.5 h-8 font-mono text-3xs font-extrabold uppercase transition-colors',
              onlyPc ? 'bg-(--acc) text-black' : 'bg-black/60 text-white/50 border border-white/10',
            )}
          >
            {onlyPc ? `✓ PC (${pcKeys.length})` : `PC (${pcKeys.length})`}
          </button>
          <div className="chamfer-sm scanlines flex h-9 flex-1 items-center gap-1 bg-black px-2 font-mono text-base font-bold tracking-[0.2em] text-[#7dffa8]">
            <span className="truncate">{query || <span className="text-[#7dffa8]/30">NOMBRE…</span>}</span>
            <span aria-hidden className="animate-caret h-4 w-2 bg-[#7dffa8]" />
            <span className="ml-auto text-2xs tracking-normal text-[#7dffa8]/60">
              {displayLimit < results.length ? `${Math.min(displayLimit, results.length)}/${results.length}` : results.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador"
            className="press chamfer-sm grid h-9 w-12 place-items-center border-t border-t-white/10 bg-[#3a1418] text-[#ff8a80]"
          >
            <X className="size-5" strokeWidth={3} aria-hidden />
          </button>
        </div>

        <div role="group" aria-label="Filtrar por generación" className="grid grid-cols-9 gap-1">
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
                title={`Gen ${insignia.gen} (${insignia.name})`}
                className={cn(
                  'press chamfer-sm relative flex h-8 items-center justify-center gap-1 border-t px-0.5 transition-transform duration-150 ease-snap active:scale-90',
                  active
                    ? 'border-t-white/40 bg-(--acc) text-black font-black shadow-sm'
                    : 'border-t-white/10 bg-[#1c1e24] text-white/70 hover:bg-[#252830]',
                  genFilter && !active && 'opacity-40',
                )}
              >
                <img
                  src={boxIconUrl(insignia.dexNumber)}
                  alt=""
                  draggable={false}
                  className="pixelated size-5 shrink-0 object-contain"
                />
                <span className="font-mono text-2xs font-extrabold leading-none">{insignia.label}</span>
              </button>
            )
          })}
        </div>

        <div role="group" aria-label="Filtrar por tipo" className="grid grid-cols-9 gap-1">
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
                  onClick={() => onPick(p.key)}
                  className="press chamfer-sm relative flex h-[3.25rem] w-full flex-col items-center justify-center border-t border-t-white/10 bg-[#22242c]"
                >
                  {inPc ? (
                    <span className="absolute top-1 right-1 font-mono text-[0.4375rem] font-extrabold px-1 leading-3 bg-(--acc) text-black rounded-[2px]">
                      PC
                    </span>
                  ) : null}
                  <img
                    src={boxIconUrl(p.iconId)}
                    alt=""
                    draggable={false}
                    className="pixelated h-[1.875rem] w-10 object-contain"
                  />
                  <span className="flex items-center gap-1 text-2xs font-bold uppercase leading-none text-white/85">
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
            <li className="col-span-4 grid h-[3.25rem] place-items-center font-mono text-2xs tracking-widest text-white/40">
              SIN COINCIDENCIAS
            </li>
          ) : null}
        </ul>

        {/* 6-column keyboard — larger keys for comfortable tapping */}
        <div role="group" aria-label="Teclado" className="flex flex-col gap-1">
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
                  className="press h-10 rounded-sm border-t border-t-white/10 bg-[#2a2c35] font-mono text-base font-bold text-white"
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
              onClick={() => results[0] && onPick(results[0].key)}
              className="press col-span-2 h-10 rounded-sm border-t border-t-white/40 bg-(--acc) font-mono text-2xs font-extrabold tracking-widest text-black disabled:opacity-40"
            >
              OK · 1º
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}


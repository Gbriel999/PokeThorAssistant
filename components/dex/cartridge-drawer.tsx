'use client'

import { Search, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { GAMES, type Platform } from '@/lib/dex/games'
import { cn } from '@/lib/utils'

type FilterTab = 'all' | 'hacks' | Platform

export function CartridgeDrawer({
  open,
  currentId,
  onClose,
  onPick,
}: {
  open: boolean
  currentId: string
  onClose: () => void
  onPick: (id: string) => void
}) {
  const [tab, setTab] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const current = GAMES.find((g) => g.id === currentId)

  const filteredGames = GAMES.filter((g) => {
    // Tab filter
    if (tab === 'hacks' && !g.isHack) return false
    if (tab === 'GBA' && g.platform !== 'GBA') return false
    if (tab === 'NDS' && g.platform !== 'NDS') return false
    if (tab === '3DS' && g.platform !== '3DS') return false
    if (tab === 'Switch' && g.platform !== 'Switch') return false

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchName = g.name.toLowerCase().includes(q)
      const matchCode = g.code.toLowerCase().includes(q)
      const matchRegion = g.region.toLowerCase().includes(q)
      return matchName || matchCode || matchRegion
    }

    return true
  })

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
        aria-label="Seleccionar cartucho"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'absolute inset-x-0 top-0 z-30 flex max-h-[92%] flex-col gap-2 border-b-2 border-black bg-shell-2 p-2 pb-3 transition-transform duration-150 ease-snap will-change-transform',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        {/* HEADER BAR */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-extrabold tracking-[0.2em] text-(--acc)">
            RANURA DE CARTUCHO
          </span>
          <span className="truncate text-3xs text-white/50">{current?.note}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar selector de juego"
            className="press chamfer-sm ml-auto grid h-7 w-10 shrink-0 place-items-center border-t border-t-white/10 bg-[#3a1418] text-[#ff8a80]"
          >
            <X className="size-4" strokeWidth={3} aria-hidden />
          </button>
        </div>

        {/* CONTROLS: PLATFORM TABS & SEARCH */}
        <div className="flex items-center justify-between gap-2 border-y border-white/10 py-1 font-mono text-3xs">
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(
              [
                { id: 'all', label: 'TODOS' },
                { id: 'hacks', label: '★ ROM HACKS', icon: true },
                { id: 'GBA', label: 'GBA' },
                { id: 'NDS', label: 'NDS' },
                { id: '3DS', label: '3DS' },
                { id: 'Switch', label: 'SWITCH' },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'press rounded-[2px] px-2 py-0.5 font-bold transition-colors whitespace-nowrap',
                  tab === id
                    ? 'bg-(--acc) text-black font-extrabold'
                    : 'bg-black/50 text-white/60 hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative flex items-center">
            <Search className="absolute left-1.5 size-3 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ROM o juego..."
              className="h-6 w-36 rounded-[2px] border border-white/10 bg-black/70 pl-5 pr-2 font-mono text-3xs text-white placeholder:text-white/30 focus:border-(--acc) focus:outline-none"
            />
          </div>
        </div>

        {/* CARTRIDGE GRID */}
        <div className="grid grid-cols-5 gap-1.5 max-h-[22rem] overflow-y-auto p-0.5">
          {filteredGames.length === 0 ? (
            <div className="col-span-5 flex h-32 flex-col items-center justify-center font-mono text-3xs text-white/40">
              No se encontraron cartuchos que coincidan con la búsqueda.
            </div>
          ) : (
            filteredGames.map((g) => {
              const active = g.id === currentId
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onPick(g.id)}
                  aria-pressed={active}
                  className={cn(
                    'press chamfer-tr flex h-32 flex-col gap-1 border-t bg-[#2a2c35] p-1.5 pt-1.5 text-left transition-colors',
                    active ? 'border-t-white/70 ring-2 ring-inset ring-white/70' : 'border-t-white/10 hover:border-t-white/30',
                  )}
                >
                  {/* PINS TOP */}
                  <span aria-hidden className="flex gap-0.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span key={i} className="h-1 flex-1 bg-black/60" />
                    ))}
                  </span>

                  {/* CARTRIDGE STICKER */}
                  <span
                    className="chamfer-sm flex flex-1 flex-col justify-between p-1.5 text-black"
                    style={{ backgroundColor: g.accent }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-extrabold leading-none">{g.code}</span>
                      <span className="rounded-[2px] bg-black/25 px-1 font-mono text-[0.4375rem] font-bold text-black">
                        {g.platform}
                      </span>
                    </div>
                    <div>
                      {g.isHack ? (
                        <span className="mb-0.5 inline-flex items-center gap-0.5 rounded-[2px] bg-black px-1 font-mono text-[0.4375rem] font-black text-[#56F39A]">
                          <Sparkles className="size-2" />
                          HACK
                        </span>
                      ) : null}
                      <span className="block truncate text-2xs font-extrabold uppercase leading-tight">
                        {g.name.replace('Pokémon ', '')}
                      </span>
                    </div>
                  </span>

                  {/* FOOTER INFO */}
                  <span className="flex items-center justify-between font-mono text-3xs tracking-wider text-white/55">
                    <span>GEN {g.gen}</span>
                    <span className="truncate pl-1">{g.region}</span>
                  </span>

                  {/* COPPER TEETH BOTTOM */}
                  <span aria-hidden className="flex gap-0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className="h-0.5 flex-1 bg-[#c9a24a]/80" />
                    ))}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </aside>
    </>
  )
}

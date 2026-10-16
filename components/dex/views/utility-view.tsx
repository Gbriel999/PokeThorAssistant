import { Check, ChevronRight, Download, Pause, Play, RefreshCw, Star, WifiOff } from 'lucide-react'
import { Fragment } from 'react'
import type { Game } from '@/lib/dex/games'
import { CATEGORY_META, categoryForGen, MOVES } from '@/lib/dex/moves'
import { useOfflineSprites } from '@/lib/dex/offline-sprites'
import { itemSpriteUrl, type Pokemon } from '@/lib/dex/pokemon'
import { cn } from '@/lib/utils'
import { Panel } from '../panel'
import { SpriteStage } from '../sprite-stage'
import { TypeIcon } from '../type-badge'

export function UtilityView({
  pokemon,
  game,
  onSelect,
}: {
  pokemon: Pokemon
  game: Game
  onSelect: (key: string) => void
}) {
  const offline = useOfflineSprites()
  const pct = offline.total > 0 ? Math.round((offline.cached / offline.total) * 100) : 0

  return (
    <div className="flex h-full flex-col gap-1.5">
      <Panel title="Linea evolutiva" bodyClassName="flex-row items-center justify-center gap-1 px-2 py-1.5">
        {pokemon.evolution.map((stage, si) => (
          <Fragment key={si}>
            {si > 0 ? (
              <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-0.5 text-center">
                {stage.map((n) => (
                  <span key={n.slug} className="flex items-center gap-0.5">
                    {n.itemId ? (
                      <img src={itemSpriteUrl(n.itemId)} alt="" draggable={false} className="pixelated size-6" />
                    ) : null}
                    <span className="font-mono text-3xs font-bold leading-tight text-(--acc)">{n.condition}</span>
                  </span>
                ))}
                <ChevronRight className="size-5 text-white/40" strokeWidth={3} aria-hidden />
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              {stage.map((n) => {
                const current = n.dexKey === pokemon.key || n.slug === pokemon.slug
                const selectable = Boolean(n.dexKey) && !current
                return (
                  <button
                    key={n.slug}
                    type="button"
                    disabled={!selectable}
                    onClick={() => n.dexKey && onSelect(n.dexKey)}
                    className={cn(
                      'chamfer-sm relative flex flex-col items-center p-1.5 transition-all',
                      current && 'border border-(--acc) bg-black/60 shadow-[0_0_12px_rgba(255,204,0,0.25)]',
                      selectable && 'press border border-white/10 bg-black/30 hover:border-white/30',
                      !selectable && !current && 'border border-transparent bg-black/20 opacity-70',
                    )}
                  >
                    <SpriteStage slug={n.slug} name={n.name} dex={n.iconId} size="sm" className={stage.length > 1 ? 'h-10' : ''} />
                    <span className={cn('text-2xs font-extrabold uppercase', current ? 'text-(--acc)' : 'text-white/80')}>
                      {n.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </Fragment>
        ))}
      </Panel>

      <Panel
        title="Movimientos clave"
        aside={<span className="font-mono text-3xs text-white/40">GEN {game.gen}</span>}
        className="flex-1"
        bodyClassName="gap-1 p-1.5"
      >
        {pokemon.learnset.map((e) => {
          const mv = MOVES[e.move]
          if (!mv) return null
          const cat = categoryForGen(mv, game.gen)
          return (
            <div
              key={`${e.level}-${e.move}`}
              className={cn(
                'chamfer-sm flex items-center gap-1.5 px-1.5',
                e.key ? 'border-l-2 border-[#F5C93B] bg-[#F5C93B]/10' : 'bg-black/45',
              )}
            >
              <span className="w-9 shrink-0 font-mono text-2xs font-extrabold text-white/50">
                {/^\d+$/.test(e.level) ? `Nv${e.level}` : e.level.toUpperCase()}
              </span>
              <TypeIcon type={mv.type} className="size-4" />
              <span className="min-w-0 flex-1 truncate text-xs font-bold">{mv.name}</span>
              {e.key ? <Star className="size-3 shrink-0 fill-[#F5C93B] text-[#F5C93B]" aria-label="Clave" /> : null}
              <img src={CATEGORY_META[cat].icon} alt={CATEGORY_META[cat].label} className="h-3 w-7 shrink-0" draggable={false} />
              <span className="w-6 shrink-0 text-right font-mono text-2xs font-bold">{mv.power ?? '—'}</span>
            </div>
          )
        })}
      </Panel>

      {/* Offline sprite download panel with background persistence */}
      <Panel
        title="Sprites offline"
        aside={
          <span className="flex items-center gap-1 font-mono text-3xs text-white/45">
            {offline.status === 'downloading' ? (
              <span className="flex items-center gap-1 font-extrabold text-[#7dffa8] animate-pulse">
                <Download className="size-3" aria-hidden />
                DESCARGANDO
              </span>
            ) : offline.status === 'done' ? (
              <span className="flex items-center gap-1 font-extrabold text-[#7dffa8]">
                <Check className="size-3" aria-hidden />
                100% OFFLINE
              </span>
            ) : offline.status === 'paused' ? (
              <span className="flex items-center gap-1 font-extrabold text-[#ffb74d]">
                <Pause className="size-3" aria-hidden />
                PAUSADO
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <WifiOff className="size-3" aria-hidden />
                Jugar sin internet
              </span>
            )}
          </span>
        }
        bodyClassName="flex-col gap-1.5 px-2.5 py-2"
      >
        {/* Progress statistics header */}
        <div className="flex items-center justify-between font-mono text-2xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-white/90">
              <strong className="text-[#7dffa8]">{offline.cached}</strong> / {offline.total} sprites guardados
            </span>
            <span className="rounded bg-white/10 px-1 py-0.2 text-3xs text-white/60">
              {pct}%
            </span>
          </div>

          <div className="max-w-[12rem] truncate text-right text-3xs text-white/60">
            {offline.status === 'downloading' && offline.currentName ? (
              <span className="text-(--acc)">Descargando: {offline.currentName}</span>
            ) : offline.status === 'done' ? (
              <span className="text-[#7dffa8]">Todos los sprites listos</span>
            ) : offline.status === 'paused' ? (
              <span className="text-[#ffb74d]">Descarga pausada</span>
            ) : offline.status === 'checking' ? (
              <span className="text-white/40">Verificando archivos...</span>
            ) : (
              <span>~2.5 MB de almacenamiento</span>
            )}
          </div>
        </div>

        {/* Clear visual progress bar */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-sm border border-white/15 bg-black/80">
          <div
            className="h-full bg-[#7dffa8] transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Actions & controls */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <p className="font-mono text-3xs text-white/40">
            {offline.status === 'downloading'
              ? 'La descarga continúa en segundo plano si cambias de pestaña.'
              : 'Permite ver los Pokémon y armar equipos sin conexión.'}
          </p>

          <div className="flex shrink-0 items-center gap-1.5">
            {offline.status === 'idle' && offline.cached < offline.total && (
              <button
                type="button"
                onClick={offline.start}
                className="press chamfer-sm flex h-7 items-center gap-1.5 px-3 border-t border-t-white/20 bg-[#123321] font-mono text-2xs font-extrabold text-[#7dffa8]"
              >
                <Download className="size-3.5" aria-hidden />
                {offline.cached === 0 ? 'DESCARGAR (1025)' : `CONTINUAR (${offline.total - offline.cached})`}
              </button>
            )}

            {offline.status === 'downloading' && (
              <button
                type="button"
                onClick={offline.pause}
                className="press chamfer-sm flex h-7 items-center gap-1.5 px-3 border-t border-t-white/20 bg-[#332212] font-mono text-2xs font-extrabold text-[#ffb74d]"
              >
                <Pause className="size-3.5" aria-hidden />
                PAUSAR
              </button>
            )}

            {offline.status === 'paused' && (
              <button
                type="button"
                onClick={offline.start}
                className="press chamfer-sm flex h-7 items-center gap-1.5 px-3 border-t border-t-white/20 bg-[#123321] font-mono text-2xs font-extrabold text-[#7dffa8]"
              >
                <Play className="size-3.5" aria-hidden />
                REANUDAR ({offline.total - offline.cached})
              </button>
            )}

            {offline.status === 'done' && (
              <button
                type="button"
                onClick={offline.check}
                className="press chamfer-sm flex h-7 items-center gap-1.5 px-2.5 border border-white/10 bg-black/40 font-mono text-3xs font-extrabold text-white/70 hover:text-white"
              >
                <RefreshCw className="size-3" aria-hidden />
                VERIFICAR
              </button>
            )}
          </div>
        </div>

        {offline.error && (
          <div className="font-mono text-3xs text-[#ff8a80]">
            {offline.error}
          </div>
        )}
      </Panel>
    </div>
  )
}

import { ChevronRight, Star } from 'lucide-react'
import { Fragment } from 'react'
import type { Game } from '@/lib/dex/games'
import { CATEGORY_META, categoryForGen, MOVES } from '@/lib/dex/moves'
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
  return (
    <div className="flex h-full flex-col gap-1.5">
      <Panel title="Línea evolutiva" bodyClassName="flex-row items-center justify-center gap-1 px-2 py-1.5">
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
                    aria-current={current ? 'true' : undefined}
                    className={cn(
                      'chamfer-sm flex w-[6.5rem] flex-col items-center pb-1 transition-transform duration-150 ease-snap enabled:active:scale-95',
                      current ? 'bg-(--acc)/20 ring-1 ring-inset ring-(--acc)' : 'bg-black/40',
                      stage.length > 1 ? 'h-[3.6rem]' : 'h-[7.5rem] justify-end',
                    )}
                  >
                    <SpriteStage slug={n.slug} name={n.name} dex={n.iconId} size="sm" className={stage.length > 1 ? 'h-10' : ''} />
                    <span className="text-2xs font-extrabold uppercase leading-none">{n.name}</span>
                  </button>
                )
              })}
            </div>
          </Fragment>
        ))}
      </Panel>

      <Panel
        title="Movimientos por nivel"
        aside={
          <span className="flex items-center gap-2 font-mono text-3xs text-white/45">
            <span className="flex items-center gap-0.5 text-[#F5C93B]">
              <Star className="size-2.5 fill-current" aria-hidden />
              NO OLVIDAR
            </span>
            {pokemon.learnsetSource}
          </span>
        }
        className="flex-1"
        bodyClassName="grid grid-cols-2 auto-rows-fr gap-1 p-1.5"
      >
        {pokemon.learnset.slice(0, 12).map((e) => {
          const mv = MOVES[e.move]
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
    </div>
  )
}

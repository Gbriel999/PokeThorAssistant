import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import {
  battleRole,
  bst,
  defensiveProfile,
  formatMult,
  groupDefense,
  speedTier,
  statColor,
  typesFor,
  type Defense,
} from '@/lib/dex/analysis'
import type { Game } from '@/lib/dex/games'
import { STAT_LABELS, type Pokemon, type StatKey } from '@/lib/dex/pokemon'
import type { CustomPokemonBuild } from '@/lib/dex/storage'
import { cn } from '@/lib/utils'
import { IvEvModal } from '../iv-ev-modal'
import { Panel } from '../panel'
import { SpriteStage } from '../sprite-stage'
import { TypeBadge, TypeChip } from '../type-badge'

const STAT_ORDER: StatKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

const ROLE_STYLE = {
  physical: 'bg-[#EE6B2F] text-black',
  special: 'bg-[#4FA3F7] text-black',
  wall: 'bg-[#B7B7CE] text-black',
  mixed: 'bg-[#C78BF7] text-black',
} as const

export function ScanView({
  pokemon,
  game,
  inPc = false,
  customBuild,
  onTogglePc,
  onSaveCustomBuild,
  onResetCustomBuild,
}: {
  pokemon: Pokemon
  game: Game
  inPc?: boolean
  customBuild?: CustomPokemonBuild
  onTogglePc?: () => void
  onSaveCustomBuild?: (custom: CustomPokemonBuild) => void
  onResetCustomBuild?: () => void
}) {
  const [ivEvOpen, setIvEvOpen] = useState(false)
  const types = typesFor(pokemon, game.gen)
  const role = battleRole(pokemon.stats)
  const groups = groupDefense(defensiveProfile(pokemon, game.gen))

  return (
    <div className="grid h-full grid-cols-[11.75rem_1fr] gap-1.5">
      <div className="flex min-h-0 flex-col gap-1.5">
        <Panel className="flex-1" bodyClassName="px-2.5 pb-2 pt-1.5">
          <div className="flex items-center justify-between font-mono text-3xs tracking-widest text-white/45">
            <span>
              Nº<span className="text-xs font-extrabold text-white">{String(pokemon.dex).padStart(3, '0')}</span>
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">{pokemon.species}</span>
              {onTogglePc ? (
                <button
                  type="button"
                  onClick={onTogglePc}
                  aria-pressed={inPc}
                  className={cn(
                    'press shrink-0 rounded-[2px] px-1 py-0.5 font-mono text-[0.5rem] font-extrabold transition-colors',
                    inPc ? 'bg-(--acc) text-black' : 'bg-white/10 text-white/60 hover:text-white',
                  )}
                >
                  {inPc ? '✓ PC' : '+ PC'}
                </button>
              ) : null}
            </div>
          </div>
          <div className="scanlines relative -mx-2.5 mt-1 flex flex-1 items-end justify-center overflow-hidden">
            <SpriteStage slug={pokemon.slug} name={pokemon.name} dex={pokemon.dex} />
          </div>
          <h1 className="mt-1 truncate text-xl font-extrabold uppercase leading-none tracking-wide">{pokemon.name}</h1>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </Panel>

        <Panel title="Habilidades" bodyClassName="gap-1 p-1.5">
          {pokemon.abilities.map((a) => (
            <div
              key={a.name}
              className={cn('chamfer-sm px-1.5 py-1', a.hidden ? 'bg-[#2a1f3d]' : 'bg-black/40')}
            >
              <div className="flex items-center gap-1">
                <span className="truncate text-xs font-bold leading-tight">{a.name}</span>
                {a.hidden ? (
                  <span className="ml-auto shrink-0 rounded-[2px] bg-[#C78BF7] px-1 font-mono text-[0.4375rem] font-extrabold leading-3 text-black">
                    OCULTA
                  </span>
                ) : null}
              </div>
              <p className="truncate text-3xs leading-tight text-white/50">{a.desc}</p>
            </div>
          ))}
        </Panel>
      </div>

      <div className="flex min-h-0 flex-col gap-1.5">
        <Panel
          title="Stats base"
          aside={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIvEvOpen(true)}
                className={cn(
                  'press chamfer-sm px-1.5 py-0.5 font-mono text-3xs font-extrabold flex items-center gap-1 transition-colors',
                  customBuild
                    ? 'bg-(--acc) text-black font-black'
                    : 'bg-black/60 text-white/80 border border-white/15 hover:text-white hover:border-(--acc)',
                )}
              >
                <SlidersHorizontal className="size-2.5" />
                {customBuild ? `CUSTOM N.${customBuild.level ?? 50}` : 'EDITAR IV/EV'}
              </button>
              <span className={cn('rounded-[2px] px-1.5 font-mono text-3xs font-extrabold leading-3.5', ROLE_STYLE[role.tone])}>
                {role.label.toUpperCase()}
              </span>
            </div>
          }
          bodyClassName="flex-row gap-2 p-2"
        >
          <div className="flex flex-1 flex-col justify-between gap-1">
            {STAT_ORDER.map((k) => {
              const v = pokemon.stats[k]
              return (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="w-6 font-mono text-3xs font-bold text-white/50">{STAT_LABELS[k]}</span>
                  <span className="w-6 text-right font-mono text-2xs font-extrabold">{v}</span>
                  <div className="relative h-2.5 flex-1 overflow-hidden bg-black/70">
                    <div
                      key={`${pokemon.key}-${k}`}
                      className="animate-bar h-full origin-left"
                      style={{ transform: `scaleX(${Math.min(v / 180, 1)})`, backgroundColor: statColor(v) }}
                    />
                    <div aria-hidden className="segments absolute inset-0" />
                  </div>
                </div>
              )
            })}
            <div className="mt-0.5 flex items-center justify-between border-t border-white/10 pt-1 font-mono text-3xs tracking-widest text-white/45">
              <span>TOTAL (BST)</span>
              <span className="text-sm font-extrabold text-white">{bst(pokemon.stats)}</span>
            </div>
          </div>

          <div className="chamfer-sm flex w-[5.5rem] flex-col items-center justify-center bg-black/60 px-1 text-center">
            <span className="font-mono text-3xs tracking-[0.2em] text-white/50">VEL BASE</span>
            <span
              className="font-mono text-[2.5rem] font-extrabold leading-none"
              style={{ color: statColor(pokemon.stats.spe) }}
            >
              {pokemon.stats.spe}
            </span>
            <span className="text-2xs font-bold uppercase text-white/70">{speedTier(pokemon.stats.spe)}</span>
          </div>
        </Panel>

        <Panel
          title="Daño recibido"
          aside={<span className="font-mono text-3xs text-white/40">GEN {game.gen}</span>}
          className="flex-1"
          bodyClassName="grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5"
        >
          <MatrixBox label="PELIGRO" mult="4x" tone="#F0483E" items={groups.x4} />
          <MatrixBox label="DÉBIL" mult="2x" tone="#F59E3B" items={groups.x2} />
          <MatrixBox label="RESISTE" mult="½ · ¼" tone="#3DDC6B" items={groups.resist} showMark />
          <MatrixBox label="INMUNE" mult="0x" tone="#8A93A8" items={groups.immune} />
        </Panel>
      </div>

      <IvEvModal
        open={ivEvOpen}
        pokemon={pokemon}
        game={game}
        defaultBuild={pokemon.builds[0]}
        customBuild={customBuild}
        onClose={() => setIvEvOpen(false)}
        onSave={(custom) => onSaveCustomBuild?.(custom)}
        onReset={() => onResetCustomBuild?.()}
      />
    </div>
  )
}

function MatrixBox({
  label,
  mult,
  tone,
  items,
  showMark,
}: {
  label: string
  mult: string
  tone: string
  items: Defense[]
  showMark?: boolean
}) {
  const empty = items.length === 0
  return (
    <div
      className={cn('chamfer-sm flex min-h-0 flex-col overflow-hidden border-l-4', empty && 'opacity-45')}
      style={{ borderColor: tone, backgroundColor: `color-mix(in srgb, ${tone} 13%, #08090c)` }}
    >
      <div className="flex h-5 shrink-0 items-center justify-between px-1.5" style={{ backgroundColor: tone }}>
        <span className="text-2xs font-extrabold tracking-[0.15em] text-black">{label}</span>
        <span className="font-mono text-xs font-extrabold text-black">{mult}</span>
      </div>
      <div className="flex flex-wrap content-start gap-1 p-1">
        {empty ? (
          <span className="font-mono text-3xs tracking-widest text-white/50">NINGUNO</span>
        ) : (
          items.map((d) => (
            <TypeChip
              key={d.type}
              type={d.type}
              mark={d.byAbility ? 'HAB' : showMark && d.mult === 0.25 ? '¼' : showMark ? formatMult(d.mult) : undefined}
            />
          ))
        )}
      </div>
    </div>
  )
}

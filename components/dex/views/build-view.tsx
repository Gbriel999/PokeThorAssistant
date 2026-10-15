import { ArrowDown, ArrowUp, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { typesFor } from '@/lib/dex/analysis'
import { calculateActualStat, getNatureMultiplier } from '@/lib/dex/calc'
import type { Game } from '@/lib/dex/games'
import { CATEGORY_META, categoryForGen, MOVES, type MoveId } from '@/lib/dex/moves'
import { itemSpriteUrl, STAT_LABELS, type Pokemon, type StatKey } from '@/lib/dex/pokemon'
import type { CustomPokemonBuild } from '@/lib/dex/storage'
import { TYPE_META, type PokeType } from '@/lib/dex/types'
import { cn } from '@/lib/utils'
import { IvEvModal } from '../iv-ev-modal'
import { Panel } from '../panel'
import { TypeIcon } from '../type-badge'

const STAT_ORDER: StatKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

export function BuildView({
  pokemon,
  game,
  buildIdx,
  customBuild,
  onBuildChange,
  onSaveCustomBuild,
  onResetCustomBuild,
}: {
  pokemon: Pokemon
  game: Game
  buildIdx: number
  customBuild?: CustomPokemonBuild
  onBuildChange: (i: number) => void
  onSaveCustomBuild?: (custom: CustomPokemonBuild) => void
  onResetCustomBuild?: () => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const build = pokemon.builds[buildIdx] ?? pokemon.builds[0]
  const ownTypes = typesFor(pokemon, game.gen)

  const effectiveNatureName = customBuild?.natureName ?? build.nature.name
  const effectiveEvs = { ...build.evs, ...(customBuild?.evs ?? {}) }
  const effectiveIvs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...(customBuild?.ivs ?? {}) }
  const level = customBuild?.level ?? 50

  return (
    <div className="flex h-full flex-col gap-1.5">
      <Panel
        title={`Set · ${build.label}`}
        aside={<span className="font-mono text-3xs text-white/40">{pokemon.name.toUpperCase()}</span>}
        bodyClassName="grid grid-cols-2 gap-1.5 p-1.5"
      >
        {build.moves.map((id, moveIdx) => (
          <MoveButton key={`${build.id}-${id}-${moveIdx}`} id={id} gen={game.gen} stab={ownTypes.includes(MOVES[id].type)} />
        ))}
      </Panel>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.15fr] gap-1.5">
        <Panel title="Objeto" bodyClassName="flex-row items-center gap-2 p-2">
          <div className="grid size-16 shrink-0 place-items-center rounded-sm border-b border-t-2 border-b-white/10 border-t-black bg-black/70">
            <img
              src={itemSpriteUrl(build.item.id)}
              alt=""
              draggable={false}
              className="pixelated size-12"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base font-extrabold leading-tight">{build.item.name}</p>
            <p className="mt-0.5 text-2xs leading-snug text-white/55">{build.item.desc}</p>
          </div>
        </Panel>

        <Panel
          title="Naturaleza · EVs"
          aside={
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={cn(
                'press chamfer-sm px-1.5 py-0.5 font-mono text-3xs font-extrabold flex items-center gap-1 transition-colors',
                customBuild
                  ? 'bg-(--acc) text-black font-black'
                  : 'bg-black/60 text-white/70 border border-white/10 hover:text-white',
              )}
            >
              <SlidersHorizontal className="size-2.5" />
              {customBuild ? `CUSTOM N.${level}` : 'AJUSTAR IV/EV'}
            </button>
          }
          bodyClassName="gap-1.5 p-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold leading-none">{effectiveNatureName}</span>
            <span className="flex items-center gap-0.5 rounded-[2px] bg-[#3DDC6B]/15 px-1 font-mono text-2xs font-bold text-[#3DDC6B]">
              <ArrowUp className="size-3" strokeWidth={3} aria-hidden />
              {STAT_LABELS[build.nature.plus]}
            </span>
            <span className="flex items-center gap-0.5 rounded-[2px] bg-[#F0483E]/15 px-1 font-mono text-2xs font-bold text-[#F0483E]">
              <ArrowDown className="size-3" strokeWidth={3} aria-hidden />
              {STAT_LABELS[build.nature.minus]}
            </span>
            <span className="ml-auto font-mono text-3xs text-white/40">NV.{level} STATS</span>
          </div>
          <div className="grid flex-1 grid-cols-6 gap-1">
            {STAT_ORDER.map((k) => {
              const v = effectiveEvs[k] ?? 0
              const iv = effectiveIvs[k] ?? 31
              const mult = getNatureMultiplier(effectiveNatureName, k)
              const finalStat = calculateActualStat(k, pokemon.stats[k], iv, v, level, mult)
              return (
                <div key={k} className={cn('flex flex-col items-center gap-0.5', v === 0 && 'opacity-40')}>
                  <div className="relative w-full flex-1 overflow-hidden bg-black/70">
                    <div
                      key={`${build.id}-${k}`}
                      className="animate-bar absolute inset-x-0 bottom-0 h-full origin-bottom bg-(--acc)"
                      style={{ transform: `scaleY(${v / 252})`, animationName: v ? undefined : 'none' }}
                    />
                  </div>
                  <span className="font-mono text-2xs font-extrabold leading-none">{v}</span>
                  <span className="font-mono text-3xs text-white/50">{STAT_LABELS[k]}</span>
                  <span className="font-mono text-[0.625rem] font-black text-[#7dffa8] leading-tight">
                    {finalStat}
                  </span>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      <IvEvModal
        open={modalOpen}
        pokemon={pokemon}
        game={game}
        defaultBuild={build}
        customBuild={customBuild}
        onClose={() => setModalOpen(false)}
        onSave={(custom) => onSaveCustomBuild?.(custom)}
        onReset={() => onResetCustomBuild?.()}
      />

      <p className="chamfer-sm flex shrink-0 items-center gap-1.5 bg-black/60 px-2 py-1 text-2xs leading-tight text-white/70">
        <span className="shrink-0 font-mono text-3xs font-extrabold tracking-widest text-(--acc)">TIP</span>
        {build.tip}
      </p>

      <div role="group" aria-label="Roles de build" className="flex shrink-0 gap-1.5">
        {pokemon.builds.map((b, i) => {
          const active = b.id === build.id
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={active}
              onClick={() => onBuildChange(i)}
              className={cn(
                'press h-9 min-w-0 flex-1 truncate rounded-full border-t px-3 text-xs font-extrabold uppercase tracking-wide',
                active ? 'border-t-white/40 bg-(--acc) text-black' : 'border-t-white/10 bg-[#22242c] text-white/70',
              )}
            >
              {b.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MoveButton({ id, gen, stab }: { id: MoveId; gen: number; stab: boolean }) {
  const mv = MOVES[id]
  const type: PokeType = mv.type
  const meta = TYPE_META[type]
  const cat = categoryForGen(mv, gen)
  const unavailable = type === 'fairy' && gen < 6
  return (
    <button
      type="button"
      className="press relative flex h-[3.75rem] items-center gap-2 overflow-hidden rounded-lg border-2 pl-1.5 pr-2 text-left"
      style={{
        borderColor: meta.color,
        backgroundColor: `color-mix(in srgb, ${meta.color} 22%, #0b0c10)`,
      }}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: meta.color }} />
      <TypeIcon type={type} className="ml-1 size-8" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-1">
          <span className="truncate text-sm font-extrabold leading-tight">{mv.name}</span>
          {stab ? (
            <span className="shrink-0 rounded-[2px] bg-white px-1 font-mono text-[0.4375rem] font-extrabold leading-3 text-black">
              STAB
            </span>
          ) : null}
          {unavailable ? (
            <span className="shrink-0 rounded-[2px] bg-[#F0483E] px-1 font-mono text-[0.4375rem] font-extrabold leading-3 text-black">
              GEN VI+
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-2 font-mono text-2xs text-white/70">
          <img src={CATEGORY_META[cat].icon} alt={CATEGORY_META[cat].label} className="h-3.5 w-8" draggable={false} />
          <span>
            <span className="text-white/40">POT </span>
            {mv.power ?? '—'}
          </span>
          <span>
            <span className="text-white/40">PRE </span>
            {mv.accuracy ?? '—'}
          </span>
          <span className="ml-auto">
            <span className="text-white/40">PP </span>
            {mv.pp}
          </span>
        </span>
      </span>
    </button>
  )
}

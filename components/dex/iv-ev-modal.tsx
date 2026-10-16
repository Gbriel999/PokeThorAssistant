'use client'

import { ArrowDown, ArrowUp, RefreshCw, X } from 'lucide-react'
import { useState } from 'react'
import {
  calculateActualStat,
  COMPETITIVE_NATURES,
  getNatureMultiplier,
} from '@/lib/dex/calc'
import type { Game } from '@/lib/dex/games'
import { boxIconUrl, STAT_LABELS, type Build, type Pokemon, type StatKey } from '@/lib/dex/pokemon'
import type { CustomPokemonBuild } from '@/lib/dex/storage'
import { cn } from '@/lib/utils'

const STAT_ORDER: StatKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

export function IvEvModal({
  open,
  pokemon,
  game,
  defaultBuild,
  customBuild,
  onClose,
  onSave,
  onReset,
}: {
  open: boolean
  pokemon: Pokemon
  game: Game
  defaultBuild: Build
  customBuild?: CustomPokemonBuild
  onClose: () => void
  onSave: (custom: CustomPokemonBuild) => void
  onReset: () => void
}) {
  const [level, setLevel] = useState<number>(customBuild?.level ?? 50)
  const [natureName, setNatureName] = useState<string>(customBuild?.natureName ?? defaultBuild.nature.name)
  const [ivs, setIvs] = useState<Record<StatKey, number>>(() => ({
    hp: customBuild?.ivs?.hp ?? 31,
    atk: customBuild?.ivs?.atk ?? 31,
    def: customBuild?.ivs?.def ?? 31,
    spa: customBuild?.ivs?.spa ?? 31,
    spd: customBuild?.ivs?.spd ?? 31,
    spe: customBuild?.ivs?.spe ?? 31,
  }))
  const [evs, setEvs] = useState<Record<StatKey, number>>(() => ({
    hp: customBuild?.evs?.hp ?? defaultBuild.evs.hp ?? 0,
    atk: customBuild?.evs?.atk ?? defaultBuild.evs.atk ?? 0,
    def: customBuild?.evs?.def ?? defaultBuild.evs.def ?? 0,
    spa: customBuild?.evs?.spa ?? defaultBuild.evs.spa ?? 0,
    spd: customBuild?.evs?.spd ?? defaultBuild.evs.spd ?? 0,
    spe: customBuild?.evs?.spe ?? defaultBuild.evs.spe ?? 0,
  }))

  if (!open) return null

  const currentNature =
    COMPETITIVE_NATURES.find(
      (n) =>
        n.name.toLowerCase() === natureName.toLowerCase() ||
        n.nameEs.toLowerCase() === natureName.toLowerCase()
    ) ?? COMPETITIVE_NATURES[0]

  const totalEvs = STAT_ORDER.reduce((sum, k) => sum + (evs[k] || 0), 0)
  const evBudgetRemaining = 510 - totalEvs

  const setStatEv = (stat: StatKey, value: number) => {
    const clamped = Math.max(0, Math.min(252, Math.floor(value)))
    setEvs((prev) => ({ ...prev, [stat]: clamped }))
  }

  const setStatIv = (stat: StatKey, value: number) => {
    const clamped = Math.max(0, Math.min(31, Math.floor(value)))
    setIvs((prev) => ({ ...prev, [stat]: clamped }))
  }

  const applyPreset = (presetEvs: Partial<Record<StatKey, number>>, recommendedNature?: string) => {
    setEvs({
      hp: presetEvs.hp ?? 0,
      atk: presetEvs.atk ?? 0,
      def: presetEvs.def ?? 0,
      spa: presetEvs.spa ?? 0,
      spd: presetEvs.spd ?? 0,
      spe: presetEvs.spe ?? 0,
    })
    if (recommendedNature) {
      setNatureName(recommendedNature)
    }
  }

  const handleSave = () => {
    onSave({
      level,
      natureName: currentNature.nameEs,
      ivs,
      evs,
    })
    onClose()
  }

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 z-40 bg-black/80 transition-opacity duration-150"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ajustar IVs y EVs"
        className="absolute inset-1 z-50 flex flex-col gap-1 border-2 border-black bg-shell-2 p-2 shadow-2xl overflow-hidden min-w-0"
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1 shrink-0">
          <img
            src={boxIconUrl(pokemon.iconId)}
            alt=""
            draggable={false}
            className="pixelated size-8 shrink-0 object-contain"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-black tracking-widest text-(--acc) truncate">
                COMPETITIVO · {pokemon.name.toUpperCase()}
              </span>
              <span className="font-mono text-3xs text-white/50 shrink-0">#{String(pokemon.dex).padStart(3, '0')}</span>
            </div>
            <span className="font-mono text-3xs text-white/40 truncate">
              {game.name.toUpperCase()} · AJUSTE FINO DE STATS
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-sm border border-white/10">
              <span className="font-mono text-3xs text-white/50">NIVEL:</span>
              <button
                type="button"
                onClick={() => setLevel(50)}
                className={cn(
                  'press px-1.5 py-0.5 font-mono text-2xs font-extrabold rounded-[2px]',
                  level === 50 ? 'bg-(--acc) text-black' : 'text-white/70'
                )}
              >
                50
              </button>
              <button
                type="button"
                onClick={() => setLevel(100)}
                className={cn(
                  'press px-1.5 py-0.5 font-mono text-2xs font-extrabold rounded-[2px]',
                  level === 100 ? 'bg-(--acc) text-black' : 'text-white/70'
                )}
              >
                100
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="press chamfer-sm grid h-8 w-9 place-items-center bg-[#3a1418] text-[#ff8a80] border-t border-t-white/10"
            >
              <X className="size-4" strokeWidth={3} aria-hidden />
            </button>
          </div>
        </div>

        {/* Nature & EV budget bar */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-1.5 bg-black/40 p-1 rounded-sm border border-white/5 shrink-0 min-w-0">
          {/* Nature selector */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-3xs font-extrabold text-white/50 shrink-0">NAT:</span>
            <select
              value={currentNature.nameEs}
              onChange={(e) => setNatureName(e.target.value)}
              className="chamfer-sm h-7 flex-1 min-w-0 bg-black px-1.5 font-mono text-2xs font-extrabold text-white border border-white/15 focus:outline-none focus:border-(--acc)"
            >
              {COMPETITIVE_NATURES.map((nat) => (
                <option key={nat.nameEs} value={nat.nameEs}>
                  {nat.nameEs} ({nat.name})
                  {nat.plus ? ` [+${STAT_LABELS[nat.plus]} / -${STAT_LABELS[nat.minus!]}]` : ' [Neutra]'}
                </option>
              ))}
            </select>
            {currentNature.plus && currentNature.minus && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="flex items-center rounded-[2px] bg-[#3DDC6B]/20 px-1 font-mono text-3xs font-bold text-[#3DDC6B]">
                  <ArrowUp className="size-2.5" />
                  {STAT_LABELS[currentNature.plus]}
                </span>
                <span className="flex items-center rounded-[2px] bg-[#F0483E]/20 px-1 font-mono text-3xs font-bold text-[#F0483E]">
                  <ArrowDown className="size-2.5" />
                  {STAT_LABELS[currentNature.minus]}
                </span>
              </div>
            )}
          </div>

          {/* EV Budget */}
          <div className="flex items-center justify-end gap-1.5 shrink-0">
            <span className="font-mono text-3xs font-extrabold text-white/50">EVs:</span>
            <div className="flex items-center gap-1 font-mono text-2xs font-black">
              <span className={cn(totalEvs > 510 ? 'text-[#ff4444]' : 'text-[#7dffa8]')}>
                {totalEvs}
              </span>
              <span className="text-white/40">/510</span>
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 rounded-[2px] text-3xs font-bold leading-none',
                  evBudgetRemaining < 0
                    ? 'bg-[#ff4444]/20 text-[#ff8a80]'
                    : 'bg-[#7dffa8]/15 text-[#7dffa8]'
                )}
              >
                {evBudgetRemaining >= 0 ? `${evBudgetRemaining} LIBRES` : `${Math.abs(evBudgetRemaining)} EXC`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-3xs font-mono shrink-0">
          <span className="text-white/40 shrink-0 font-bold">PRESETS:</span>
          <button
            type="button"
            onClick={() => applyPreset({ atk: 252, spe: 252, hp: 4 }, 'Alegre')}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
          >
            ATQ+VEL
          </button>
          <button
            type="button"
            onClick={() => applyPreset({ spa: 252, spe: 252, hp: 4 }, 'Miedosa')}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
          >
            ATE+VEL
          </button>
          <button
            type="button"
            onClick={() => applyPreset({ hp: 252, def: 252, spd: 4 }, 'Osada')}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
          >
            PS+DEF
          </button>
          <button
            type="button"
            onClick={() => applyPreset({ hp: 252, spd: 252, def: 4 }, 'Serena')}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
          >
            PS+DFE
          </button>
          <button
            type="button"
            onClick={() => setIvs({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 })}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
          >
            IVs 31
          </button>
          <button
            type="button"
            onClick={() => setStatIv('atk', 0)}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
            title="Minimiza daño por confusión y Foul Play"
          >
            0 ATQ
          </button>
          <button
            type="button"
            onClick={() => setStatIv('spe', 0)}
            className="press px-1.5 py-1 rounded-sm bg-[#22242c] text-white/70 hover:text-white border border-white/10 shrink-0"
            title="Ideal para Espacio Raro / Trick Room"
          >
            0 VEL
          </button>
          <button
            type="button"
            onClick={() => applyPreset({}, currentNature.nameEs)}
            className="press px-1.5 py-1 rounded-sm bg-[#3a1418] text-[#ff8a80] border border-[#ff8a80]/20 shrink-0"
          >
            LIMPIAR
          </button>
        </div>

        {/* 6 Stats Rows - Clean, balanced, touch-friendly, NO clipping */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-0.5 min-w-0">
          {STAT_ORDER.map((stat) => {
            const base = pokemon.stats[stat]
            const iv = ivs[stat]
            const ev = evs[stat]
            const mult = getNatureMultiplier(currentNature.nameEs, stat)
            const finalStat = calculateActualStat(stat, base, iv, ev, level, mult)

            const isPlus = currentNature.plus === stat
            const isMinus = currentNature.minus === stat

            return (
              <div
                key={stat}
                className="grid grid-cols-[4.25rem_5.75rem_1fr_3.75rem] items-center gap-1.5 bg-black/50 p-1 px-1.5 rounded-sm border border-white/10 min-w-0"
              >
                {/* 1. Stat label & base */}
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className={cn(
                      'font-mono text-xs font-black w-6 shrink-0',
                      isPlus && 'text-[#3DDC6B]',
                      isMinus && 'text-[#F0483E]',
                      !isPlus && !isMinus && 'text-white'
                    )}
                  >
                    {STAT_LABELS[stat]}
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-mono text-[0.45rem] text-white/40">BASE</span>
                    <span className="font-mono text-2xs font-bold">{base}</span>
                  </div>
                  {isPlus && <span className="font-mono text-2xs font-black text-[#3DDC6B] leading-none">+</span>}
                  {isMinus && <span className="font-mono text-2xs font-black text-[#F0483E] leading-none">-</span>}
                </div>

                {/* 2. IV Controls: comfortable size-7 buttons */}
                <div className="flex items-center gap-1 bg-[#1a1c22] p-0.5 rounded-sm border border-white/10 shrink-0">
                  <span className="font-mono text-3xs text-white/40 font-bold">IV:</span>
                  <button
                    type="button"
                    onClick={() => setStatIv(stat, iv - 1)}
                    className="press size-6 grid place-items-center rounded bg-black/70 font-mono text-xs font-black text-white/80 active:bg-white active:text-black"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs font-black text-white w-4 text-center">{iv}</span>
                  <button
                    type="button"
                    onClick={() => setStatIv(stat, iv + 1)}
                    className="press size-6 grid place-items-center rounded bg-black/70 font-mono text-xs font-black text-white/80 active:bg-white active:text-black"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatIv(stat, 31)}
                    className={cn(
                      'press px-1 text-3xs font-mono font-black rounded-[2px]',
                      iv === 31 ? 'text-(--acc)' : 'text-white/40 hover:text-white'
                    )}
                  >
                    31
                  </button>
                </div>

                {/* 3. EV Controls: comfortable touch buttons and progress */}
                <div className="flex items-center gap-1 min-w-0">
                  <div className="flex items-center gap-1 bg-[#1a1c22] p-0.5 rounded-sm border border-white/10 shrink-0">
                    <span className="font-mono text-3xs text-white/40 font-bold">EV:</span>
                    <button
                      type="button"
                      onClick={() => setStatEv(stat, ev - 4)}
                      className="press size-6 grid place-items-center rounded bg-black/70 font-mono text-xs font-black text-white/80 active:bg-white active:text-black"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={252}
                      step={4}
                      value={ev}
                      onChange={(e) => setStatEv(stat, Number(e.target.value))}
                      className="w-8 h-6 bg-black font-mono text-xs font-black text-center text-white border border-white/15 rounded-sm p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setStatEv(stat, ev + 4)}
                      className="press size-6 grid place-items-center rounded bg-black/70 font-mono text-xs font-black text-white/80 active:bg-white active:text-black"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatEv(stat, 0)}
                      className="press px-1 text-3xs font-mono font-bold text-white/40 hover:text-white"
                      title="Poner a 0"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatEv(stat, 252)}
                      className={cn(
                        'press px-1 text-3xs font-mono font-black rounded-[2px]',
                        ev === 252 ? 'text-(--acc)' : 'text-white/40 hover:text-white'
                      )}
                      title="Poner a 252 (Max)"
                    >
                      252
                    </button>
                  </div>

                  {/* Micro EV bar */}
                  <div className="h-1.5 flex-1 min-w-[1.5rem] bg-black/80 rounded-full overflow-hidden border border-white/10 relative">
                    <div
                      className="h-full bg-(--acc) transition-all duration-100"
                      style={{ width: `${(ev / 252) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 4. Final calculated in-battle stat */}
                <div className="flex flex-col items-end justify-center bg-black/70 px-1.5 py-0.5 rounded-sm border border-white/10 shrink-0">
                  <span className="font-mono text-[0.45rem] text-white/40 font-bold leading-none">
                    NV.{level}
                  </span>
                  <span className="font-mono text-xs font-black text-[#7dffa8] leading-tight">
                    {finalStat}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-1.5 border-t border-white/10 pt-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              onReset()
              onClose()
            }}
            className="press chamfer-sm px-2 h-8 font-mono text-2xs font-extrabold text-white/60 hover:text-white bg-[#22242c] border-t border-t-white/10 flex items-center gap-1"
          >
            <RefreshCw className="size-3" />
            RESET
          </button>

          <button
            type="button"
            onClick={onClose}
            className="press chamfer-sm ml-auto px-3 h-8 font-mono text-2xs font-extrabold text-white/70 bg-[#22242c] border-t border-t-white/10"
          >
            CANCELAR
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="press chamfer-sm px-4 h-8 font-mono text-2xs font-black tracking-widest bg-(--acc) text-black border-t border-t-white/40"
          >
            GUARDAR BUILD
          </button>
        </div>
      </div>
    </>
  )
}

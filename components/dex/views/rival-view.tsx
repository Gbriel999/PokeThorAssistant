'use client'

import { Crosshair, Search, Shield, ShieldAlert, Sparkles, Star, Zap } from 'lucide-react'
import { battleRole, speedTier, typesFor } from '@/lib/dex/analysis'
import type { Game } from '@/lib/dex/games'
import { rankTeamAgainstRival, type MatchupResult } from '@/lib/dex/matchup'
import { boxIconUrl, DEX_BY_KEY, type Pokemon } from '@/lib/dex/pokemon'
import { cn } from '@/lib/utils'
import { Panel } from '../panel'
import { SpriteStage } from '../sprite-stage'
import { TypeBadge } from '../type-badge'

export function RivalView({
  rival,
  team,
  pcKeys,
  game,
  onOpenRivalSearch,
  onSelectPokemon,
}: {
  rival: Pokemon
  team: Pokemon[]
  pcKeys: string[]
  game: Game
  onOpenRivalSearch: () => void
  onSelectPokemon?: (key: string) => void
}) {
  const rivalTypes = typesFor(rival, game.gen)
  const rivalRole = battleRole(rival.stats)

  // Rank active team members against this rival
  const teamRankings = rankTeamAgainstRival(team, rival, game.gen)

  // Rank PC members against this rival
  const pcMembers = pcKeys
    .map((k) => DEX_BY_KEY[k])
    .filter((p): p is Pokemon => Boolean(p && p.key !== rival.key))
  const pcRankings = rankTeamAgainstRival(pcMembers, rival, game.gen).slice(0, 5)

  return (
    <div className="grid h-full grid-cols-[10.5rem_1fr] gap-1.5 min-w-0 overflow-hidden">
      {/* LEFT COLUMN: RIVAL SCOUT CARD */}
      <div className="flex min-h-0 min-w-0 flex-col gap-1.5 overflow-hidden">
        <Panel
          className="flex-1 min-h-0 min-w-0 overflow-hidden"
          bodyClassName="px-2 pb-2 pt-1.5"
          aside={
            <button
              type="button"
              onClick={onOpenRivalSearch}
              className="press flex items-center gap-1 rounded-[2px] bg-(--acc) px-1.5 py-0.5 font-mono text-3xs font-extrabold text-black"
              title="Buscar el Pokémon que sacará el rival"
            >
              <Search className="size-2.5" strokeWidth={3} />
              <span>CAMBIAR</span>
            </button>
          }
        >
          <div className="flex items-center justify-between font-mono text-3xs tracking-widest text-white/45">
            <span className="flex items-center gap-1 text-[#FF5555]">
              <Crosshair className="size-3" strokeWidth={2.5} />
              <span className="font-extrabold">RIVAL EN PISTA</span>
            </span>
            <span>Nº{String(rival.dex).padStart(3, '0')}</span>
          </div>

          <div className="scanlines -mx-2 mt-1 flex flex-1 items-end justify-center min-h-0 overflow-hidden">
            <SpriteStage key={rival.slug} slug={rival.slug} name={rival.name} dex={rival.dex} />
          </div>

          <h1 className="mt-1 truncate text-base font-extrabold uppercase leading-none tracking-wide text-white">
            {rival.name}
          </h1>

          <div className="mt-1 flex flex-wrap gap-1">
            {rivalTypes.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          <div className="mt-1.5 flex flex-col gap-0.5 border-t border-white/10 pt-1 font-mono text-3xs">
            <div className="flex items-center justify-between text-white/70">
              <span className="text-white/40">Velocidad:</span>
              <span className="font-bold text-white">
                {rival.stats.spe} <span className="text-3xs text-white/50 font-normal">({speedTier(rival.stats.spe)})</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span className="text-white/40">Rol Rival:</span>
              <span className="font-bold text-(--acc)">{rivalRole.label}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Habilidades del Rival" className="shrink-0 min-w-0" bodyClassName="gap-1 p-1.5">
          <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
            {rival.abilities.map((a) => (
              <div
                key={a.name}
                className={cn('chamfer-sm px-1.5 py-0.5', a.hidden ? 'bg-[#2a1f3d]' : 'bg-black/40')}
              >
                <div className="flex items-center gap-1">
                  <span className="truncate text-2xs font-bold leading-tight">{a.name}</span>
                  {a.hidden ? (
                    <span className="ml-auto shrink-0 rounded-[2px] bg-[#C78BF7] px-1 font-mono text-[0.4375rem] font-extrabold leading-3 text-black">
                      OCULTA
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* RIGHT COLUMN: TEAM COUNTER RANKING & PC ALTERNATIVES */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
        {/* TEAM COUNTERS LIST */}
        <Panel
          className="flex-1 min-h-0 min-w-0 overflow-hidden"
          title="Quién debe pelear (Tu Equipo)"
          aside={
            <span className="font-mono text-3xs text-white/45">
              {teamRankings.length} Pokémon listos
            </span>
          }
          bodyClassName="gap-1.5 p-1.5 overflow-y-auto min-w-0"
        >
          {teamRankings.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center font-mono text-xs text-white/40">
              <ShieldAlert className="mb-2 size-8 text-white/20" />
              <p>No tienes Pokémon en tu equipo activo.</p>
              <p className="mt-1 text-3xs text-white/30">Agrega integrantes en SCAN o EQUIPO para ver sus recomendaciones.</p>
            </div>
          ) : (
            teamRankings.map((result, idx) => (
              <TeamMemberMatchupCard
                key={result.pokemon.key}
                result={result}
                isBest={idx === 0}
                onSelect={() => onSelectPokemon?.(result.pokemon.key)}
              />
            ))
          )}
        </Panel>

        {/* PC COUNTERS (COMPACT) */}
        <Panel
          title="Alternativas en tu PC (Reserva)"
          className="h-24 shrink-0 min-w-0 overflow-hidden"
          bodyClassName="p-1 overflow-x-auto min-w-0"
        >
          {pcRankings.length === 0 ? (
            <div className="flex h-full items-center justify-center font-mono text-3xs text-white/40">
              PC vacío · Guarda Pokémon con (+PC) en el buscador para ver refuerzos aquí.
            </div>
          ) : (
            <div className="flex h-full items-center gap-1.5">
              {pcRankings.map((res) => (
                <div
                  key={res.pokemon.key}
                  onClick={() => onSelectPokemon?.(res.pokemon.key)}
                  className="press chamfer-sm flex h-full w-28 shrink-0 flex-col justify-between border border-white/10 bg-[#16181f] p-1.5 cursor-pointer hover:border-white/30"
                >
                  <div className="flex items-center gap-1">
                    <img
                      src={boxIconUrl(res.pokemon.iconId)}
                      alt=""
                      className="pixelated size-6 shrink-0 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-2xs font-extrabold text-white">
                        {res.pokemon.name}
                      </div>
                      <div className="flex items-center text-[#F7D02C]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'size-2.5',
                              i < res.stars ? 'fill-[#F7D02C] text-[#F7D02C]' : 'text-white/20',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="truncate font-mono text-[0.5rem] font-bold text-(--acc)">
                    {res.verdict}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

function TeamMemberMatchupCard({
  result,
  isBest,
  onSelect,
}: {
  result: MatchupResult
  isBest: boolean
  onSelect: () => void
}) {
  const { pokemon, stars, tone, offensiveSummary, defensiveSummary, bestMoveName, faster } =
    result

  const toneBorder =
    tone === 'counter'
      ? 'border-[#F7D02C] bg-[#F7D02C]/10'
      : tone === 'advantage'
        ? 'border-[#56F39A]/60 bg-[#56F39A]/5'
        : tone === 'danger'
          ? 'border-[#FF4545]/60 bg-[#FF4545]/5'
          : 'border-white/10 bg-black/40'

  const badgeColor =
    tone === 'counter'
      ? 'bg-[#F7D02C] text-black'
      : tone === 'advantage'
        ? 'bg-[#56F39A] text-black'
        : tone === 'danger'
          ? 'bg-[#FF4545] text-white'
          : tone === 'disadvantage'
            ? 'bg-[#EE8130] text-black'
            : 'bg-white/20 text-white'

  const shortVerdict =
    tone === 'counter'
      ? 'COUNTER'
      : tone === 'advantage'
        ? 'VENTAJA'
        : tone === 'danger'
          ? 'PELIGRO'
          : tone === 'disadvantage'
            ? 'DESVENTAJA'
            : 'NEUTRO'

  return (
    <div
      onClick={onSelect}
      className={cn(
        'press chamfer-sm relative flex flex-col gap-1 border p-1.5 transition-colors cursor-pointer w-full min-w-0 overflow-hidden',
        toneBorder,
        isBest && 'ring-1 ring-[#F7D02C]/80',
      )}
    >
      {/* HEADER: POKEMON INFO + STAR RATING + VERDICT BADGE */}
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 shrink">
          <img
            src={boxIconUrl(pokemon.iconId)}
            alt=""
            className="pixelated size-6 shrink-0 object-contain"
          />
          <span className="font-mono text-xs font-extrabold text-white truncate max-w-[5.5rem]">{pokemon.name}</span>
          {isBest ? (
            <span className="flex items-center gap-0.5 rounded-[2px] bg-[#F7D02C] px-1 font-mono text-[0.4375rem] font-black text-black shrink-0">
              <Sparkles className="size-2" />
              SACA A ESTE
            </span>
          ) : null}
        </div>

        {/* 1 TO 5 STAR RATING + SHORT VERDICT BADGE */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'size-3',
                  i < stars
                    ? stars === 5
                      ? 'fill-[#F7D02C] text-[#F7D02C]'
                      : stars >= 4
                        ? 'fill-[#56F39A] text-[#56F39A]'
                        : stars === 3
                          ? 'fill-[#B7B7CE] text-[#B7B7CE]'
                          : stars === 2
                            ? 'fill-[#EE8130] text-[#EE8130]'
                            : 'fill-[#FF4545] text-[#FF4545]'
                    : 'text-white/15',
                )}
              />
            ))}
          </div>
          <span className={cn('rounded-[2px] px-1 py-0.5 font-mono text-[0.4375rem] font-extrabold leading-none', badgeColor)}>
            {shortVerdict}
          </span>
        </div>
      </div>

      {/* TACTICAL DETAILS: 2 CLEAN FULL-WIDTH ROWS (NO TRUNCATION / OVERFLOW) */}
      {/* ROW 1: OFFENSE */}
      <div className="flex items-center gap-1 min-w-0 rounded bg-black/45 px-1.5 py-0.5 font-mono text-3xs text-white/90">
        <Zap className="size-2.5 shrink-0 text-[#F7D02C]" />
        <span className="truncate">
          {offensiveSummary}
          {bestMoveName ? ` (${bestMoveName})` : ''}
        </span>
      </div>

      {/* ROW 2: DEFENSE + SPEED */}
      <div className="flex items-center justify-between gap-1 min-w-0 rounded bg-black/45 px-1.5 py-0.5 font-mono text-3xs text-white/90">
        <div className="flex items-center gap-1 min-w-0 truncate">
          <Shield className="size-2.5 shrink-0 text-[#4FA3F7]" />
          <span className="truncate">{defensiveSummary}</span>
        </div>
        <span className={cn('shrink-0 font-extrabold text-[0.4375rem] px-1 py-0.2 rounded', faster ? 'bg-[#56F39A]/20 text-[#56F39A]' : 'bg-white/10 text-white/45')}>
          {faster ? '⚡ +VEL' : '🐢 -VEL'}
        </span>
      </div>
    </div>
  )
}

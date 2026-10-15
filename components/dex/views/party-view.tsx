'use client'

import { AlertTriangle, Edit3, Plus, RotateCcw, ShieldCheck, Trash2, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { teamSynergy, typesFor } from '@/lib/dex/analysis'
import type { Game } from '@/lib/dex/games'
import { boxIconUrl, type Pokemon } from '@/lib/dex/pokemon'
import type { SavedTeam } from '@/lib/dex/storage'
import { TYPE_META } from '@/lib/dex/types'
import { cn } from '@/lib/utils'
import { Panel } from '../panel'
import { TypeChip, TypeIcon } from '../type-badge'

export function PartyView({
  team,
  game,
  currentKey,
  pcKeys = [],
  savedTeams = [{ id: 'team-1', name: 'Equipo Principal', team: [null, null, null, null, null, null] }],
  activeTeamId = 'team-1',
  onSelect,
  onRemove,
  onSwitchTeam,
  onCreateTeam,
  onRenameTeam,
  onDeleteTeam,
  onResetAll,
}: {
  team: Pokemon[]
  game: Game
  currentKey: string
  pcKeys?: string[]
  savedTeams?: SavedTeam[]
  activeTeamId?: string
  onSelect: (key: string) => void
  onRemove: (key: string) => void
  onSwitchTeam?: (id: string) => void
  onCreateTeam?: (name?: string) => void
  onRenameTeam?: (id: string, name: string) => void
  onDeleteTeam?: (id: string) => void
  onResetAll?: () => void
}) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingName, setEditingName] = useState('')
  const [newTeamName, setNewTeamName] = useState('')

  const syn = team.length ? teamSynergy(team, game.gen, pcKeys) : null
  const topThreat = syn?.threats[0]

  return (
    <div className="relative flex h-full flex-col gap-1.5 overflow-hidden">
      {/* TOP BAR: MULTI-TEAM MANAGEMENT ACROSS ROMS / SAVES */}
      <div className="chamfer-sm flex items-center justify-between border border-white/10 bg-[#16181f] px-2 py-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <UsersRound className="size-3.5 text-(--acc) shrink-0" />
          <span className="font-mono text-3xs font-extrabold text-white/50 tracking-wider shrink-0">
            EQUIPO:
          </span>

          {/* TEAMS PILLS */}
          <div className="flex items-center gap-1 overflow-x-auto min-w-0">
            {savedTeams.map((t) => {
              const isActive = t.id === activeTeamId
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSwitchTeam?.(t.id)}
                  className={cn(
                    'press chamfer-sm flex items-center gap-1 px-2 py-0.5 font-mono text-3xs font-extrabold transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-(--acc) text-black shadow-sm'
                      : 'bg-black/60 text-white/60 hover:text-white',
                  )}
                >
                  <span className="truncate max-w-[6rem]">{t.name}</span>
                  <span className={cn('text-[0.5rem]', isActive ? 'text-black/60' : 'text-white/30')}>
                    ({t.team.filter(Boolean).length}/6)
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ACTIONS: NUEVO / RENOMBRAR / BORRAR / RESET */}
        <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-white/10">
          <button
            type="button"
            onClick={() => {
              setNewTeamName(`Equipo ${savedTeams.length + 1}`)
              setIsCreating(true)
            }}
            className="press flex items-center gap-0.5 rounded-[2px] bg-white/10 px-1.5 py-0.5 font-mono text-3xs font-bold text-white hover:bg-white/20"
            title="Crear nuevo equipo"
          >
            <Plus className="size-2.5 text-[#56F39A]" />
            <span>NUEVO</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const cur = savedTeams.find((t) => t.id === activeTeamId)
              if (cur) {
                setEditingName(cur.name)
                setIsRenaming(true)
              }
            }}
            className="press flex items-center gap-0.5 rounded-[2px] bg-white/10 px-1.5 py-0.5 font-mono text-3xs font-bold text-white hover:bg-white/20"
            title="Renombrar equipo activo"
          >
            <Edit3 className="size-2.5 text-[#F5C93B]" />
            <span>RENOMBRAR</span>
          </button>
          {savedTeams.length > 1 ? (
            <button
              type="button"
              onClick={() => onDeleteTeam?.(activeTeamId)}
              className="press flex items-center gap-0.5 rounded-[2px] bg-[#3a1418] px-1.5 py-0.5 font-mono text-3xs font-bold text-[#ff8a80] hover:bg-[#5a1c22]"
              title="Eliminar este equipo"
            >
              <Trash2 className="size-2.5" />
              <span>BORRAR</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (confirm('¿Reiniciar los datos de esta partida a 0?')) {
                onResetAll?.()
              }
            }}
            className="press flex items-center gap-0.5 rounded-[2px] bg-black/40 px-1.5 py-0.5 font-mono text-3xs font-bold text-white/40 hover:text-white"
            title="Limpiar datos (empezar de 0)"
          >
            <RotateCcw className="size-2.5" />
            <span>A 0</span>
          </button>
        </div>
      </div>

      {/* MAIN PARTY GRID */}
      <div className="grid min-h-0 flex-1 grid-cols-[10.5rem_1fr] gap-1.5 overflow-hidden">
        {/* LEFT COLUMN: ACTIVE MEMBERS */}
        <Panel
          title={`Miembros ${team.length}/6`}
          className="min-h-0 overflow-hidden"
          bodyClassName="gap-1 p-1.5 overflow-y-auto"
        >
          {team.map((p) => {
            const active = p.key === currentKey
            return (
              <div
                key={p.key}
                className={cn('chamfer-sm flex h-[2.5rem] items-center', active ? 'bg-(--acc)/25' : 'bg-black/45')}
              >
                <button
                  type="button"
                  onClick={() => onSelect(p.key)}
                  className="flex h-full min-w-0 flex-1 items-center gap-1 pl-0.5 text-left active:opacity-70"
                >
                  <img src={boxIconUrl(p.iconId)} alt="" draggable={false} className="pixelated h-[1.75rem] w-8 shrink-0 object-contain" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-2xs font-bold uppercase leading-none">{p.name}</span>
                    <span className="flex gap-0.5">
                      {typesFor(p, game.gen).map((t) => (
                        <TypeIcon key={t} type={t} className="size-3" />
                      ))}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(p.key)}
                  aria-label={`Quitar a ${p.name}`}
                  className="grid h-full w-7 shrink-0 place-items-center text-white/40 active:bg-black/40 active:text-[#ff8a80]"
                >
                  <X className="size-3.5" strokeWidth={3} aria-hidden />
                </button>
              </div>
            )
          })}
          {team.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-3 text-center font-mono text-3xs tracking-widest text-white/40">
              <UsersRound className="mb-1 size-6 text-white/20" />
              <span>EQUIPO VACÍO</span>
              <span className="mt-1 text-[0.5rem] text-white/30">Agrega Pokémon desde el buscador o el dock inferior.</span>
            </div>
          ) : null}
        </Panel>

        {/* RIGHT COLUMN: RADAR & SYNERGY */}
        <div className="flex min-h-0 flex-col gap-1.5 overflow-hidden">
          {topThreat && topThreat.weak >= 3 ? (
            <div
              role="alert"
              className="chamfer-sm flex h-7 shrink-0 items-center gap-2 border-l-4 border-[#F0483E] bg-[#3a1418] px-2"
            >
              <AlertTriangle className="animate-alert size-3.5 shrink-0 text-[#F0483E]" strokeWidth={2.5} aria-hidden />
              <span className="text-2xs font-extrabold uppercase tracking-wide text-[#ffb4ad]">
                Alerta: {topThreat.weak} débiles a
              </span>
              <TypeChip type={topThreat.type} />
              <span className="ml-auto font-mono text-3xs text-white/45">{topThreat.resist} resisten</span>
            </div>
          ) : (
            <div className="chamfer-sm flex h-7 shrink-0 items-center gap-2 border-l-4 border-[#3DDC6B] bg-[#102a1a] px-2">
              <ShieldCheck className="size-3.5 text-[#3DDC6B]" strokeWidth={2.5} aria-hidden />
              <span className="text-2xs font-extrabold uppercase tracking-wide text-[#a8f5c0]">
                {team.length === 0 ? 'Esperando integrantes del equipo' : 'Sin debilidades compartidas críticas'}
              </span>
            </div>
          )}

          <Panel
            title="Radar de tipos"
            aside={
              <span className="flex items-center gap-2 font-mono text-3xs text-white/45">
                <span className="flex items-center gap-0.5">
                  <span className="size-1.5 bg-[#F0483E]" />
                  DÉB
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="size-1.5 bg-[#3DDC6B]" />
                  RES
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="size-1.5 rounded-full bg-(--acc)" />
                  COB
                </span>
              </span>
            }
            className="flex-1 min-h-0 overflow-hidden"
            bodyClassName="grid grid-cols-6 auto-rows-fr gap-1 p-1.5 overflow-y-auto"
          >
            {syn?.rows.map((r) => {
              const danger = r.weak >= 3
              return (
                <div
                  key={r.type}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-0.5 rounded-sm border bg-black/50 p-1',
                    danger ? 'animate-alert border-[#F0483E]' : 'border-white/5',
                  )}
                >
                  {r.covered ? (
                    <span
                      aria-label="Cubierto ofensivamente"
                      className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-(--acc)"
                    />
                  ) : null}
                  <TypeIcon type={r.type} className="size-4" />
                  <span className="text-3xs font-bold uppercase leading-none text-white/70">{TYPE_META[r.type].short}</span>
                  <Pips count={r.weak} color="#F0483E" label="débiles" />
                  <Pips count={r.resist} color="#3DDC6B" label="resisten" />
                </div>
              )
            })}
          </Panel>

          <Panel title="Recomendación Táctica" className="h-28 shrink-0 min-h-0 overflow-hidden" bodyClassName="gap-1 p-1.5 overflow-y-auto">
            {syn && syn.pcRecommendations && syn.pcRecommendations.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-3xs font-extrabold tracking-widest text-(--acc)">
                  DE TU PC SUGIERE:
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {syn.pcRecommendations.slice(0, 2).map((rec) => (
                    <button
                      key={rec.pokemon.key}
                      type="button"
                      onClick={() => onSelect(rec.pokemon.key)}
                      className="press chamfer-sm flex items-center gap-1 bg-black/60 p-1 text-left active:opacity-70"
                    >
                      <img src={boxIconUrl(rec.pokemon.iconId)} alt="" className="pixelated size-5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-2xs font-extrabold uppercase leading-none text-white">{rec.pokemon.name}</p>
                        <p className="truncate font-mono text-[0.5rem] text-(--acc) leading-tight mt-0.5">{rec.reasons[0]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : syn && syn.wildRecommendations && syn.wildRecommendations.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-3xs font-extrabold tracking-widest text-white/50">
                  REFUERZO META RECOMENDADO:
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {syn.wildRecommendations.slice(0, 2).map((rec) => (
                    <button
                      key={rec.pokemon.key}
                      type="button"
                      onClick={() => onSelect(rec.pokemon.key)}
                      className="press chamfer-sm flex items-center gap-1 bg-black/50 p-1 text-left active:opacity-70"
                    >
                      <img src={boxIconUrl(rec.pokemon.iconId)} alt="" className="pixelated size-5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-2xs font-extrabold uppercase leading-none text-white">{rec.pokemon.name}</p>
                        <p className="truncate font-mono text-[0.5rem] text-white/60 leading-tight mt-0.5">{rec.reasons[0]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-2xs text-white/50">
                {team.length === 0
                  ? 'Agrega integrantes para calcular debilidades y recomendaciones.'
                  : 'Defensa equilibrada. Mantén la variedad de tipos.'}
              </p>
            )}

            {syn && syn.suggestions.length ? (
              <div className="flex flex-wrap items-center gap-1 text-2xs pt-0.5 border-t border-white/5">
                <span className="font-bold text-white/60">Contra</span>
                <TypeChip type={syn.suggestions[0].threat} />
                <span className="font-bold text-white/60">añade:</span>
                {syn.suggestions[0].partners.map((t) => (
                  <TypeChip key={t} type={t} />
                ))}
              </div>
            ) : null}
          </Panel>
        </div>
      </div>

      {/* MODAL: RENOMBRAR EQUIPO */}
      {isRenaming && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/75 p-4 animate-in fade-in duration-100">
          <div className="chamfer-sm w-80 border border-white/20 bg-shell-2 p-3 font-mono shadow-2xl">
            <h3 className="text-xs font-extrabold uppercase text-(--acc) tracking-wider">
              Renombrar Equipo
            </h3>
            <p className="mt-1 text-3xs text-white/50">Escribe el nombre para este equipo en tu partida:</p>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              autoFocus
              maxLength={24}
              placeholder="Ej. Nuzlocke, Equipo Gimnasio..."
              className="mt-2 h-7 w-full rounded-[2px] border border-white/20 bg-black/80 px-2 text-xs text-white focus:border-(--acc) focus:outline-none"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRenaming(false)}
                className="press rounded px-2 py-1 text-2xs text-white/60 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingName.trim()) {
                    onRenameTeam?.(activeTeamId, editingName.trim())
                    setIsRenaming(false)
                  }
                }}
                className="press rounded-[2px] bg-(--acc) px-3 py-1 text-2xs font-extrabold text-black"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVO EQUIPO */}
      {isCreating && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/75 p-4 animate-in fade-in duration-100">
          <div className="chamfer-sm w-80 border border-white/20 bg-shell-2 p-3 font-mono shadow-2xl">
            <h3 className="text-xs font-extrabold uppercase text-(--acc) tracking-wider">
              Nuevo Equipo de Partida
            </h3>
            <p className="mt-1 text-3xs text-white/50">Crea una nueva alineación para probar otra estrategia:</p>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              autoFocus
              maxLength={24}
              placeholder="Nombre del nuevo equipo..."
              className="mt-2 h-7 w-full rounded-[2px] border border-white/20 bg-black/80 px-2 text-xs text-white focus:border-(--acc) focus:outline-none"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="press rounded px-2 py-1 text-2xs text-white/60 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onCreateTeam?.(newTeamName.trim() || undefined)
                  setIsCreating(false)
                }}
                className="press rounded-[2px] bg-(--acc) px-3 py-1 text-2xs font-extrabold text-black"
              >
                Crear Equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Pips({ count, color, label }: { count: number; color: string; label: string }) {
  return (
    <span className="flex gap-px" aria-label={`${count} ${label}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="h-1 w-1.5"
          style={{ backgroundColor: i < count ? color : 'rgb(255 255 255 / 0.08)' }}
        />
      ))}
    </span>
  )
}

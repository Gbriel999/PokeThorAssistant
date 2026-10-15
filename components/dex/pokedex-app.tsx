'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { typesFor } from '@/lib/dex/analysis'
import { GAMES } from '@/lib/dex/games'
import { DEX_BY_KEY, POKEDEX } from '@/lib/dex/pokemon'
import { loadGameState, saveGameState, clearGameStorage, type CustomPokemonBuild, type SavedTeam } from '@/lib/dex/storage'
import { TYPE_META } from '@/lib/dex/types'
import { CartridgeDrawer } from './cartridge-drawer'
import { LeftDock, type Mode } from './left-dock'
import { PartyDock } from './party-dock'
import { RightDock } from './right-dock'
import { SearchDrawer } from './search-drawer'
import { TopBar } from './top-bar'
import { BuildView } from './views/build-view'
import { PartyView } from './views/party-view'
import { RivalView } from './views/rival-view'
import { ScanView } from './views/scan-view'
import { UtilityView } from './views/utility-view'

const INITIAL_TEAM: (string | null)[] = [null, null, null, null, null, null]

export function PokedexApp() {
  const [gameId, setGameId] = useState('luminescent')
  const [mode, setMode] = useState<Mode>('scan')
  const [currentKey, setCurrentKey] = useState('garchomp')
  const [rivalKey, setRivalKey] = useState('articuno')
  const [buildIdx, setBuildIdx] = useState(0)
  const [teams, setTeams] = useState<SavedTeam[]>([
    { id: 'team-1', name: 'Equipo Principal', team: [...INITIAL_TEAM] },
  ])
  const [activeTeamId, setActiveTeamId] = useState('team-1')
  const [team, setTeam] = useState<(string | null)[]>([...INITIAL_TEAM])
  const [pcKeys, setPcKeys] = useState<string[]>([])
  const [customBuilds, setCustomBuilds] = useState<Record<string, CustomPokemonBuild>>({})
  const [drawer, setDrawer] = useState<null | 'search' | 'cart' | 'rival'>(null)
  const isLoaded = useRef(false)

  const game = GAMES.find((g) => g.id === gameId) ?? GAMES[0]
  const pokemon = DEX_BY_KEY[currentKey] ?? POKEDEX[0]
  const rivalPokemon = DEX_BY_KEY[rivalKey] ?? pokemon
  const primaryType = typesFor(pokemon, game.gen)[0]
  const teamMembers = useMemo(() => team.filter((k): k is string => Boolean(k && DEX_BY_KEY[k])).map((k) => DEX_BY_KEY[k]), [team])

  // Load game state on mount or cartridge change
  useEffect(() => {
    const saved = loadGameState(gameId, INITIAL_TEAM)
    setTeams(saved.teams)
    setActiveTeamId(saved.activeTeamId)
    setTeam(saved.team)
    setPcKeys(saved.pc)
    setCustomBuilds(saved.customBuilds ?? {})
    isLoaded.current = true
  }, [gameId])

  // Save game state whenever team, pc, or custom builds change
  useEffect(() => {
    if (!isLoaded.current) return
    saveGameState(gameId, {
      teams: teams.map((t) => (t.id === activeTeamId ? { ...t, team } : t)),
      activeTeamId,
      team,
      pc: pcKeys,
      customBuilds,
    })
  }, [gameId, teams, activeTeamId, team, pcKeys, customBuilds])

  const handleCreateTeam = useCallback((name?: string) => {
    const newId = `team-${Date.now()}`
    const newTeam: SavedTeam = {
      id: newId,
      name: name?.trim() || `Equipo ${teams.length + 1}`,
      team: [...INITIAL_TEAM],
    }
    setTeams((prev) => [...prev, newTeam])
    setActiveTeamId(newId)
    setTeam(newTeam.team)
  }, [teams.length])

  const handleRenameTeam = useCallback((id: string, newName: string) => {
    if (!newName.trim()) return
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name: newName.trim() } : t)))
  }, [])

  const handleDeleteTeam = useCallback((id: string) => {
    setTeams((prev) => {
      if (prev.length <= 1) return prev
      const remaining = prev.filter((t) => t.id !== id)
      if (activeTeamId === id) {
        setActiveTeamId(remaining[0].id)
        setTeam(remaining[0].team)
      }
      return remaining
    })
  }, [activeTeamId])

  const handleSwitchTeam = useCallback((id: string) => {
    setTeams((prev) => {
      const updated = prev.map((t) => (t.id === activeTeamId ? { ...t, team } : t))
      const target = updated.find((t) => t.id === id)
      if (target) {
        setActiveTeamId(id)
        setTeam(target.team)
      }
      return updated
    })
  }, [activeTeamId, team])

  const handleResetAll = useCallback(() => {
    clearGameStorage(gameId)
    const fresh = loadGameState(gameId, INITIAL_TEAM)
    setTeams(fresh.teams)
    setActiveTeamId(fresh.activeTeamId)
    setTeam(fresh.team)
    setPcKeys([])
    setCustomBuilds({})
  }, [gameId])

  const handleSaveCustomBuild = useCallback((key: string, custom: CustomPokemonBuild) => {
    setCustomBuilds((prev) => ({ ...prev, [key]: custom }))
  }, [])

  const handleResetCustomBuild = useCallback((key: string) => {
    setCustomBuilds((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const select = useCallback((key: string) => {
    setCurrentKey(key)
    setBuildIdx(0)
  }, [])

  const inTeam = team.includes(currentKey)
  const teamFull = !team.includes(null)

  const toggleTeam = () => {
    setTeam((prev) => {
      if (prev.includes(currentKey)) return prev.map((k) => (k === currentKey ? null : k))
      const free = prev.indexOf(null)
      if (free === -1) return prev
      return prev.map((k, i) => (i === free ? currentKey : k))
    })
  }

  const togglePc = useCallback((key: string) => {
    setPcKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }, [])

  const removeFromTeam = (key: string) => setTeam((prev) => prev.map((k) => (k === key ? null : k)))

  const cycle = (dir: 1 | -1) => {
    const pool = inTeam ? teamMembers.map((p) => p.key) : POKEDEX.map((p) => p.key)
    const idx = pool.indexOf(currentKey)
    select(pool[(idx + dir + pool.length) % pool.length])
  }

  const style = {
    '--acc': game.accent,
    '--led': TYPE_META[primaryType].color,
  } as CSSProperties

  return (
    <div className="fixed inset-0 grid place-items-center bg-black">
      <div
        style={style}
        className="relative flex aspect-[31/27] h-[33.75rem] w-[38.75rem] select-none flex-col overflow-hidden bg-amoled text-white"
      >
        <TopBar game={game} pokemon={pokemon} mode={mode} onOpenCartridge={() => setDrawer('cart')} />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <LeftDock mode={mode} onChange={setMode} />
          <main className="min-w-0 flex-1 p-1.5 overflow-hidden">
            <div key={mode} className="animate-view h-full min-w-0 overflow-hidden">
              {mode === 'scan' && (
                <ScanView
                  pokemon={pokemon}
                  game={game}
                  inPc={pcKeys.includes(currentKey)}
                  customBuild={customBuilds[pokemon.key]}
                  onTogglePc={() => togglePc(currentKey)}
                  onSaveCustomBuild={(b) => handleSaveCustomBuild(pokemon.key, b)}
                  onResetCustomBuild={() => handleResetCustomBuild(pokemon.key)}
                />
              )}
              {mode === 'rival' && (
                <RivalView
                  rival={rivalPokemon}
                  team={teamMembers}
                  pcKeys={pcKeys}
                  game={game}
                  onOpenRivalSearch={() => setDrawer('rival')}
                  onSelectPokemon={(key) => select(key)}
                />
              )}
              {mode === 'build' && (
                <BuildView
                  pokemon={pokemon}
                  game={game}
                  buildIdx={buildIdx}
                  customBuild={customBuilds[pokemon.key]}
                  onBuildChange={setBuildIdx}
                  onSaveCustomBuild={(b) => handleSaveCustomBuild(pokemon.key, b)}
                  onResetCustomBuild={() => handleResetCustomBuild(pokemon.key)}
                />
              )}
              {mode === 'party' && (
                <PartyView
                  team={teamMembers}
                  game={game}
                  currentKey={currentKey}
                  pcKeys={pcKeys}
                  savedTeams={teams}
                  activeTeamId={activeTeamId}
                  onSelect={select}
                  onRemove={removeFromTeam}
                  onSwitchTeam={handleSwitchTeam}
                  onCreateTeam={handleCreateTeam}
                  onRenameTeam={handleRenameTeam}
                  onDeleteTeam={handleDeleteTeam}
                  onResetAll={handleResetAll}
                />
              )}
              {mode === 'util' && <UtilityView pokemon={pokemon} game={game} onSelect={select} />}
            </div>
          </main>
          <RightDock
            inTeam={inTeam}
            teamFull={teamFull}
            onSearch={() => setDrawer('search')}
            onPrev={() => cycle(-1)}
            onNext={() => cycle(1)}
            onToggleTeam={toggleTeam}
          />
        </div>

        <PartyDock
          team={team}
          currentKey={currentKey}
          onSelect={select}
          onEmpty={() => setDrawer('search')}
        />

        <SearchDrawer
          open={drawer === 'search' || drawer === 'rival'}
          game={game}
          pcKeys={pcKeys}
          onTogglePc={togglePc}
          onClose={() => setDrawer(null)}
          onPick={(key) => {
            if (drawer === 'rival') {
              setRivalKey(key)
            } else {
              select(key)
            }
            setDrawer(null)
          }}
        />
        <CartridgeDrawer
          open={drawer === 'cart'}
          currentId={game.id}
          onClose={() => setDrawer(null)}
          onPick={(id) => {
            setGameId(id)
            setDrawer(null)
          }}
        />
      </div>
    </div>
  )
}

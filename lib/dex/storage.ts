export type CustomPokemonBuild = {
  evs?: Partial<Record<string, number>>
  ivs?: Partial<Record<string, number>>
  level?: number
  natureName?: string
}

export type SavedTeam = {
  id: string
  name: string
  team: (string | null)[]
}

export type GameStorageState = {
  teams: SavedTeam[]
  activeTeamId: string
  team: (string | null)[]
  pc: string[]
  customBuilds?: Record<string, CustomPokemonBuild>
}

const STORAGE_PREFIX = 'silph_dex_state_'
export const EMPTY_TEAM: (string | null)[] = [null, null, null, null, null, null]

export function loadGameState(gameId: string, defaultTeam: (string | null)[] = EMPTY_TEAM): GameStorageState {
  const initialTeams: SavedTeam[] = [
    { id: 'team-1', name: 'Equipo Principal', team: [...defaultTeam] },
  ]
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') {
    return {
      teams: initialTeams,
      activeTeamId: 'team-1',
      team: [...defaultTeam],
      pc: [],
      customBuilds: {},
    }
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`)
    if (!raw) {
      return {
        teams: initialTeams,
        activeTeamId: 'team-1',
        team: [...defaultTeam],
        pc: [],
        customBuilds: {},
      }
    }
    const parsed = JSON.parse(raw) as Partial<GameStorageState> & { team?: (string | null)[] }

    // Parse teams or migrate from single team format
    let teams: SavedTeam[] = []
    if (Array.isArray(parsed.teams) && parsed.teams.length > 0) {
      teams = parsed.teams.map((t, idx) => ({
        id: typeof t.id === 'string' ? t.id : `team-${idx + 1}`,
        name: typeof t.name === 'string' && t.name.trim() ? t.name : `Equipo ${idx + 1}`,
        team: Array.isArray(t.team) && t.team.length === 6 ? t.team : [...EMPTY_TEAM],
      }))
    } else if (Array.isArray(parsed.team) && parsed.team.length === 6) {
      teams = [{ id: 'team-1', name: 'Equipo Principal', team: parsed.team }]
    } else {
      teams = initialTeams
    }

    const activeTeamId =
      typeof parsed.activeTeamId === 'string' && teams.some((t) => t.id === parsed.activeTeamId)
        ? parsed.activeTeamId
        : teams[0].id

    const activeTeam = teams.find((t) => t.id === activeTeamId)?.team ?? teams[0].team

    return {
      teams,
      activeTeamId,
      team: activeTeam,
      pc: Array.isArray(parsed.pc) ? parsed.pc.filter((k): k is string => typeof k === 'string') : [],
      customBuilds:
        parsed.customBuilds && typeof parsed.customBuilds === 'object' && !Array.isArray(parsed.customBuilds)
          ? parsed.customBuilds
          : {},
    }
  } catch {
    return {
      teams: initialTeams,
      activeTeamId: 'team-1',
      team: [...defaultTeam],
      pc: [],
      customBuilds: {},
    }
  }
}

export function saveGameState(gameId: string, state: Partial<GameStorageState> & { team?: (string | null)[] }): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return
  try {
    // Ensure teams array matches active team
    const teams = state.teams && state.teams.length > 0
      ? state.teams
      : [{ id: 'team-1', name: 'Equipo Principal', team: state.team ?? [...EMPTY_TEAM] }]

    const activeTeamId = state.activeTeamId ?? teams[0].id
    const activeTeam = state.team ?? teams.find((t) => t.id === activeTeamId)?.team ?? [...EMPTY_TEAM]

    const fullState: GameStorageState = {
      teams: teams.map((t) => (t.id === activeTeamId ? { ...t, team: activeTeam } : t)),
      activeTeamId,
      team: activeTeam,
      pc: state.pc ?? [],
      customBuilds: state.customBuilds ?? {},
    }

    localStorage.setItem(`${STORAGE_PREFIX}${gameId}`, JSON.stringify(fullState))
  } catch {}
}

export function clearGameStorage(gameId?: string): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return
  try {
    if (gameId) {
      localStorage.removeItem(`${STORAGE_PREFIX}${gameId}`)
    } else {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX))
      for (const k of keys) {
        localStorage.removeItem(k)
      }
    }
  } catch {}
}

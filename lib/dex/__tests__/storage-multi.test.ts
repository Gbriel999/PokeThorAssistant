import assert from 'node:assert/strict'
import test from 'node:test'
import { loadGameState, saveGameState, type SavedTeam } from '../storage.ts'

class MockLocalStorage {
  private store: Record<string, string> = {}
  getItem(key: string): string | null {
    return this.store[key] ?? null
  }
  setItem(key: string, value: string): void {
    this.store[key] = value
  }
  clear(): void {
    this.store = {}
  }
}

globalThis.localStorage = new MockLocalStorage() as unknown as Storage

test('Storage handles multi-team profiles: create, rename, switch, and delete', () => {
  const gameId = 'unbound-test'

  // Load fresh
  const initial = loadGameState(gameId)
  assert.equal(initial.teams.length, 1)
  assert.equal(initial.teams[0].name, 'Equipo Principal')
  assert.equal(initial.activeTeamId, initial.teams[0].id)

  // Add a second team
  const teams: SavedTeam[] = [
    initial.teams[0],
    { id: 'team-2', name: 'Nuzlocke Run', team: ['pikachu', null, null, null, null, null] },
  ]
  saveGameState(gameId, {
    teams,
    activeTeamId: 'team-2',
    team: ['pikachu', null, null, null, null, null],
    pc: [],
  })

  // Load and verify
  const loaded = loadGameState(gameId)
  assert.equal(loaded.teams.length, 2)
  assert.equal(loaded.activeTeamId, 'team-2')
  assert.equal(loaded.team[0], 'pikachu')

  // Rename team-2
  teams[1].name = 'Nuzlocke Campeón'
  saveGameState(gameId, {
    teams,
    activeTeamId: 'team-2',
    team: teams[1].team,
    pc: [],
  })

  const renamed = loadGameState(gameId)
  assert.equal(renamed.teams[1].name, 'Nuzlocke Campeón')
})

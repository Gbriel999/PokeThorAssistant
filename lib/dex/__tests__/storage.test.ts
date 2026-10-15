import assert from 'node:assert/strict'
import test from 'node:test'
import { loadGameState, saveGameState, type GameStorageState } from '../storage.ts'

// Mock localStorage for node environment
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

test('Storage handles fallback and persistence cleanly per gameId', () => {
  const defaultTeam = ['garchomp', 'scizor', null, null, null, null]

  // Initial load returns default
  const initial = loadGameState('luminescent', defaultTeam)
  assert.deepEqual(initial.team, defaultTeam)
  assert.deepEqual(initial.pc, [])

  // Save state
  const newState: GameStorageState = {
    team: ['lucario', 'gengar', 'metagross', null, null, null],
    pc: ['chansey', 'ferrothorn', 'swampert'],
  }
  saveGameState('luminescent', newState)

  // Loaded state matches saved
  const loaded = loadGameState('luminescent', defaultTeam)
  assert.deepEqual(loaded.team, newState.team)
  assert.deepEqual(loaded.pc, newState.pc)

  // Isolated by gameId: 'unbound' should still have default
  const unboundState = loadGameState('unbound', defaultTeam)
  assert.deepEqual(unboundState.team, defaultTeam)
  assert.deepEqual(unboundState.pc, [])

  // Corrupted data handling
  localStorage.setItem('silph_dex_state_corrupt', '{invalid json}')
  const recovered = loadGameState('corrupt', defaultTeam)
  assert.deepEqual(recovered.team, defaultTeam)
  assert.deepEqual(recovered.pc, [])
})

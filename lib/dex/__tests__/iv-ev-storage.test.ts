import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateActualStat, getGenForDexNumber } from '../calc.ts'
import { loadGameState, saveGameState, type GameStorageState } from '../storage.ts'
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

test('getGenForDexNumber maps national dex number to generations 1 through 9', () => {
  assert.equal(getGenForDexNumber(6), 1) // Charizard
  assert.equal(getGenForDexNumber(157), 2) // Typhlosion
  assert.equal(getGenForDexNumber(257), 3) // Blaziken
  assert.equal(getGenForDexNumber(392), 4) // Infernape
  assert.equal(getGenForDexNumber(497), 5) // Serperior
  assert.equal(getGenForDexNumber(658), 6) // Greninja
  assert.equal(getGenForDexNumber(724), 7) // Decidueye
  assert.equal(getGenForDexNumber(815), 8) // Cinderace
  assert.equal(getGenForDexNumber(908), 9) // Meowscarada
  assert.equal(getGenForDexNumber(1025), 9) // Pecharunt
})

test('calculateActualStat calculates exact stats for competitive battles', () => {
  // Garchomp at level 50:
  // Base HP 108, IV 31, EV 0 -> (2*108 + 31 + 0)*50/100 + 50 + 10 = 123.5 + 60 = 183
  const hp = calculateActualStat('hp', 108, 31, 0, 50, 1)
  assert.equal(hp, 183)

  // Garchomp Atk base 130, IV 31, EV 252, Nature 1.0 (neutral) -> ((2*130 + 31 + 63)*50/100 + 5)*1.0 = (177 + 5)*1 = 182
  const atkNeutral = calculateActualStat('atk', 130, 31, 252, 50, 1.0)
  assert.equal(atkNeutral, 182)

  // Garchomp Atk base 130, IV 31, EV 252, Adamant nature (1.1) -> floor(182 * 1.1) = 200
  const atkPositive = calculateActualStat('atk', 130, 31, 252, 50, 1.1)
  assert.equal(atkPositive, 200)

  // Garchomp Spe base 102, IV 31, EV 252, Level 100, Jolly nature (1.1)
  // floor(((2*102 + 31 + 63)*100/100 + 5) * 1.1) = floor((204 + 31 + 63 + 5) * 1.1) = floor(303 * 1.1) = 333
  const speLevel100 = calculateActualStat('spe', 102, 31, 252, 100, 1.1)
  assert.equal(speLevel100, 333)
})

test('Storage isolates team, pc, and custom IVs/EVs strictly per game', () => {
  const gameAState: GameStorageState = {
    team: ['garchomp', 'scizor', null, null, null, null],
    pc: ['lucario'],
    customBuilds: {
      garchomp: {
        evs: { atk: 252, spe: 252 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
      },
    },
  }

  saveGameState('gameA', gameAState)

  const loadedA = loadGameState('gameA', [])
  assert.deepEqual(loadedA.customBuilds?.garchomp?.evs, { atk: 252, spe: 252 })

  // gameB is completely isolated
  const loadedB = loadGameState('gameB', [])
  assert.deepEqual(loadedB.customBuilds, {})
  assert.deepEqual(loadedB.pc, [])
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { GAMES } from '../games.ts'
import { typeMultiplier, typesForGen } from '../types.ts'

test('GAMES contains all required target games', () => {
  const ids = GAMES.map((g) => g.id)
  assert.ok(ids.includes('luminescent'), 'Must include Platino Brillante (luminescent)')
  assert.ok(ids.includes('unbound'), 'Must include Pokemon Unbound (unbound)')
  assert.ok(ids.includes('black2'), 'Must include Pokemon Blanco 2 (black2)')
  assert.ok(ids.includes('pokemon-y'), 'Must include Pokemon Y (pokemon-y)')
  assert.ok(ids.includes('ultramoon'), 'Must include Pokemon Ultra Luna (ultramoon)')
})

test('Type multiplier respects generation mechanics', () => {
  // Gen 5: Steel resists Ghost and Dark
  assert.equal(typeMultiplier('dark', 'steel', 5), 0.5)
  assert.equal(typeMultiplier('ghost', 'steel', 5), 0.5)

  // Gen 6+: Steel takes neutral from Ghost and Dark
  assert.equal(typeMultiplier('dark', 'steel', 6), 1.0)
  assert.equal(typeMultiplier('ghost', 'steel', 6), 1.0)

  // Fairy mechanics
  assert.equal(typeMultiplier('fairy', 'dragon', 6), 2.0)
  assert.equal(typeMultiplier('dragon', 'fairy', 6), 0)
  assert.equal(typesForGen(5).includes('fairy'), false)
  assert.equal(typesForGen(6).includes('fairy'), true)
})

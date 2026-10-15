import assert from 'node:assert/strict'
import test from 'node:test'
import { MOVES } from '../moves.ts'
import { DEX_BY_KEY, POKEDEX } from '../pokemon.ts'

test('POKEDEX contains all 1025 base Pokemon across Gen 1 to Gen 9 without gaps', () => {
  assert.ok(POKEDEX.length >= 1025, `Pokedex has ${POKEDEX.length} mons, expected at least 1025`)

  // Check every single National Dex number from 1 to 1025 is present
  const allDexNumbers = new Set(POKEDEX.map((p) => p.dex))
  for (let num = 1; num <= 1025; num++) {
    assert.ok(allDexNumbers.has(num), `Pokemon with National Dex #${num} must exist in POKEDEX`)
  }

  // Staples across all generations including Gen 8/Hisui and Gen 9
  const requiredKeys = [
    // Gen 1-4
    'garchomp',
    'scizor',
    'rotom-wash',
    'tyranitar',
    'gardevoir',
    'gengar',
    'lucario',
    'dragonite',
    'infernape',
    // Gen 5-7
    'metagross',
    'excadrill',
    'volcarona',
    'greninja',
    'mimikyu',
    'togekiss',
    // Gen 8 & Hisui
    'corviknight',
    'cinderace',
    'wyrdeer',
    'kleavor',
    'ursaluna',
    'ursaluna-bloodmoon',
    // Gen 9
    'meowscarada',
    'skeledirge',
    'tinkaton',
    'greattusk',
    'fluttermane',
    'gholdengo',
    'koraidon',
    'miraidon',
    'pecharunt',
  ]

  for (const k of requiredKeys) {
    assert.ok(DEX_BY_KEY[k], `Pokemon ${k} must exist in DEX_BY_KEY`)
  }
})

test('Every Pokemon has valid builds, legal moves and EV budgets', () => {
  for (const p of POKEDEX) {
    assert.ok(p.key, 'Pokemon must have a key')
    assert.ok(p.name, `${p.key} must have a name`)
    assert.ok(p.types.length >= 1, `${p.key} must have at least 1 type`)
    assert.ok(p.builds.length >= 1, `${p.key} must have at least 1 build`)

    for (const b of p.builds) {
      assert.equal(b.moves.length, 4, `${p.key} build ${b.id} must have 4 moves`)
      for (const mId of b.moves) {
        assert.ok(MOVES[mId], `${p.key} build ${b.id} references unknown move: ${mId}`)
      }
      const totalEvs = Object.values(b.evs).reduce((acc, v) => acc + (v ?? 0), 0)
      assert.ok(totalEvs <= 510, `${p.key} build ${b.id} exceeds 510 total EVs (${totalEvs})`)
      assert.ok(b.item, `${p.key} build ${b.id} must have an item`)
      assert.ok(b.nature, `${p.key} build ${b.id} must have a nature`)
    }
  }
})

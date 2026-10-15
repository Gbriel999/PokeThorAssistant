import assert from 'node:assert/strict'
import test from 'node:test'
import { ITEMS } from '../items.ts'
import { categoryForGen, MOVES } from '../moves.ts'

test('ITEMS contains standard competitive and story items', () => {
  assert.ok(ITEMS.leftovers, 'Leftovers must exist')
  assert.ok(ITEMS.lifeOrb, 'Life Orb must exist')
  assert.ok(ITEMS.choiceScarf, 'Choice Scarf must exist')
  assert.ok(ITEMS.choiceBand, 'Choice Band must exist')
  assert.ok(ITEMS.choiceSpecs, 'Choice Specs must exist')
  assert.ok(ITEMS.eviolite, 'Eviolite must exist')
  assert.ok(ITEMS.assaultVest, 'Assault Vest must exist')
  assert.ok(ITEMS.focusSash, 'Focus Sash must exist')
  assert.ok(ITEMS.rockyHelmet, 'Rocky Helmet must exist')
})

test('MOVES contains essential meta moves and categoryForGen adapts to Gen 3 rules', () => {
  // Key moves exist
  assert.ok(MOVES['earthquake'])
  assert.ok(MOVES['close-combat'])
  assert.ok(MOVES['scald'])
  assert.ok(MOVES['flamethrower'])
  assert.ok(MOVES['moonblast'])
  assert.ok(MOVES['roost'])
  assert.ok(MOVES['stealth-rock'])

  // Gen 3 vs Gen 4+ physical/special split
  // Fire was Special in Gen 3, but Fire Punch is Physical in Gen 4+
  assert.equal(categoryForGen(MOVES['fire-punch'], 3), 'special')
  assert.equal(categoryForGen(MOVES['fire-punch'], 4), 'physical')

  // Ghost was Physical in Gen 3, but Shadow Ball is Special in Gen 4+
  assert.equal(categoryForGen(MOVES['shadow-ball'], 3), 'physical')
  assert.equal(categoryForGen(MOVES['shadow-ball'], 4), 'special')
})

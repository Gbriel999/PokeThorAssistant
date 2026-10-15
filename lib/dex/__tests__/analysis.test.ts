import assert from 'node:assert/strict'
import test from 'node:test'
import { teamSynergy } from '../analysis.ts'
import { DEX_BY_KEY } from '../pokemon.ts'

test('teamSynergy calculates threats and recommends matching PC candidates', () => {
  // Team of Lucario + Tyranitar (Both weak to Ground and Fighting)
  const team = [DEX_BY_KEY['lucario'], DEX_BY_KEY['tyranitar']]

  // Player has Rotom-Wash and Gengar in PC
  const pcKeys = ['rotom-wash', 'gengar']

  const result = teamSynergy(team, 8, pcKeys)

  // Ground and Fighting must be threats
  const threatTypes = result.threats.map((t) => t.type)
  assert.ok(threatTypes.includes('ground'), 'Ground must be a threat')
  assert.ok(threatTypes.includes('fighting'), 'Fighting must be a threat')

  // PC recommendations must recommend Rotom-Wash (immune to Ground)
  assert.ok(result.pcRecommendations.length > 0, 'Must have PC recommendations')
  const topPc = result.pcRecommendations[0]
  assert.equal(topPc.pokemon.key, 'rotom-wash')
  assert.ok(topPc.resistsThreats.includes('ground'), 'Rotom-Wash must register resistance/immunity to ground')
  assert.ok(topPc.reasons.length > 0, 'Must provide tactical reasons')
})

test('teamSynergy falls back to wild meta recommendations when PC is empty', () => {
  const team = [DEX_BY_KEY['lucario'], DEX_BY_KEY['tyranitar']]
  const result = teamSynergy(team, 8, [])

  assert.equal(result.pcRecommendations.length, 0)
  assert.ok(result.wildRecommendations.length > 0, 'Must provide wild recommendations')
  const topWild = result.wildRecommendations[0]
  // Must counter the team's critical threat (Ground or Fighting)
  assert.ok(topWild.resistsThreats.includes('ground') || topWild.resistsThreats.includes('fighting'))
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateMatchup, rankTeamAgainstRival } from '../matchup.ts'
import { DEX_BY_KEY } from '../pokemon.ts'

test('evaluateMatchup computes accurate 1-5 star ratings and tactical advice', () => {
  const garchomp = DEX_BY_KEY['garchomp']
  const scizor = DEX_BY_KEY['scizor']
  const rotomWash = DEX_BY_KEY['rotom-wash']
  const gyarados = DEX_BY_KEY['gyarados']
  const articuno = DEX_BY_KEY['articuno']

  // Rotom-Wash vs Gyarados: Electric hits x4, immune to Earthquake -> 5 stars
  const rotomVsGyarados = evaluateMatchup(rotomWash, gyarados, 8)
  assert.equal(rotomVsGyarados.stars, 5)
  assert.ok(rotomVsGyarados.offensiveSummary.includes('4x') || rotomVsGyarados.offensiveSummary.includes('Eléctrico'))

  // Garchomp vs Articuno: Ice hits Garchomp x4 -> 1 star (danger)
  const garchompVsArticuno = evaluateMatchup(garchomp, articuno, 8)
  assert.equal(garchompVsArticuno.stars, 1)

  // Scizor vs Articuno: Steel hits x2, resists Ice -> 4 or 5 stars
  const scizorVsArticuno = evaluateMatchup(scizor, articuno, 8)
  assert.ok(scizorVsArticuno.stars >= 4)
})

test('rankTeamAgainstRival sorts team members by effectiveness against enemy', () => {
  const team = [DEX_BY_KEY['garchomp'], DEX_BY_KEY['rotom-wash'], DEX_BY_KEY['scizor']]
  const gyarados = DEX_BY_KEY['gyarados']

  const ranked = rankTeamAgainstRival(team, gyarados, 8)
  assert.equal(ranked[0].pokemon.key, 'rotom-wash')
  assert.equal(ranked[0].stars, 5)
})

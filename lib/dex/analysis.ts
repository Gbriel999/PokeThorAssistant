import { MOVES } from './moves'
import { DEX_BY_KEY, POKEDEX, type Pokemon, type Stats } from './pokemon'
import { TYPE_META, typeMultiplier, typesForGen, type PokeType } from './types'

export function typesFor(p: Pokemon, gen: number): PokeType[] {
  return gen < 6 && p.legacyTypes ? p.legacyTypes : p.types
}

export type Defense = { type: PokeType; mult: number; byAbility?: string }

export function defensiveProfile(p: Pokemon, gen: number): Defense[] {
  const defTypes = typesFor(p, gen)
  return typesForGen(gen).map((atk) => {
    if (atk === 'ground' && p.groundImmuneAbility) {
      return { type: atk, mult: 0, byAbility: p.groundImmuneAbility }
    }
    const mult = defTypes.reduce((acc, d) => acc * typeMultiplier(atk, d, gen), 1)
    return { type: atk, mult }
  })
}

export function groupDefense(profile: Defense[]) {
  return {
    x4: profile.filter((d) => d.mult >= 4),
    x2: profile.filter((d) => d.mult === 2),
    resist: profile.filter((d) => d.mult > 0 && d.mult < 1),
    immune: profile.filter((d) => d.mult === 0),
  }
}

export type Role = { label: string; tone: 'physical' | 'special' | 'wall' | 'mixed' }

export function battleRole(s: Stats): Role {
  const bulk = (s.hp + s.def + s.spd) / 3
  const offense = Math.max(s.atk, s.spa)
  if (bulk > offense + 5) return { label: 'Muralla', tone: 'wall' }
  if (s.atk - s.spa >= 15) return { label: 'Atacante Físico', tone: 'physical' }
  if (s.spa - s.atk >= 15) return { label: 'Atacante Especial', tone: 'special' }
  return { label: 'Atacante Mixto', tone: 'mixed' }
}

export function speedTier(spe: number) {
  if (spe >= 110) return 'Muy rápido'
  if (spe >= 95) return 'Rápido'
  if (spe >= 75) return 'Medio'
  if (spe >= 55) return 'Lento'
  return 'Muy lento'
}

export function statColor(v: number) {
  if (v >= 120) return '#2EE6FF'
  if (v >= 90) return '#3DDC6B'
  if (v >= 60) return '#F5C93B'
  return '#F0483E'
}

export const bst = (s: Stats) => s.hp + s.atk + s.def + s.spa + s.spd + s.spe

export type TeamTypeRow = {
  type: PokeType
  weak: number
  resist: number
  covered: boolean
}

export type PokemonRecommendation = {
  pokemon: Pokemon
  source: 'pc' | 'wild'
  score: number
  reasons: string[]
  resistsThreats: PokeType[]
  coversGaps: PokeType[]
}

export function teamSynergy(team: Pokemon[], gen: number, pcKeys: string[] = []) {
  const types = typesForGen(gen)
  const profiles = team.map((p) => defensiveProfile(p, gen))
  const attackTypes = new Set<PokeType>()
  for (const p of team) {
    for (const id of p.builds[0].moves) {
      const mv = MOVES[id]
      if (mv && mv.category !== 'status') attackTypes.add(mv.type)
    }
  }

  const rows: TeamTypeRow[] = types.map((t, i) => {
    let weak = 0
    let resist = 0
    for (const prof of profiles) {
      const mult = prof[i]?.mult ?? 1
      if (mult > 1) weak++
      else if (mult < 1) resist++
    }
    const covered = [...attackTypes].some((a) => typeMultiplier(a, t, gen) > 1)
    return { type: t, weak, resist, covered }
  })

  const threats = rows
    .filter((r) => r.weak >= 3 || (r.weak >= 2 && r.resist === 0))
    .sort((a, b) => b.weak - a.weak || a.resist - b.resist)

  const suggestions = threats.slice(0, 2).map((r) => ({
    threat: r.type,
    partners: types
      .filter((d) => typeMultiplier(r.type, d, gen) < 1)
      .sort((a, b) => typeMultiplier(r.type, a, gen) - typeMultiplier(r.type, b, gen))
      .slice(0, 3),
  }))

  const gaps = rows.filter((r) => !r.covered).map((r) => r.type)
  const gapFixers = gaps.length
    ? types
        .map((a) => ({ type: a, hits: gaps.filter((g) => typeMultiplier(a, g, gen) > 1).length }))
        .filter((x) => x.hits > 0)
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 3)
    : []

  const teamKeys = new Set(team.map((p) => p.key))

  const scoreCandidate = (cand: Pokemon, source: 'pc' | 'wild'): PokemonRecommendation | null => {
    if (teamKeys.has(cand.key)) return null

    let score = 0
    const reasons: string[] = []
    const resistsThreats: PokeType[] = []
    const coversGaps: PokeType[] = []

    const candDef = defensiveProfile(cand, gen)
    const candTypes = typesFor(cand, gen)
    const candAtkTypes = new Set<PokeType>(candTypes)
    for (const mId of cand.builds[0].moves) {
      const mv = MOVES[mId]
      if (mv && mv.category !== 'status') candAtkTypes.add(mv.type)
    }

    // Defensive evaluation against team threats
    for (const thr of threats) {
      const defEntry = candDef.find((d) => d.type === thr.type)
      const mult = defEntry?.mult ?? 1

      if (mult === 0) {
        score += 5
        resistsThreats.push(thr.type)
        reasons.push(`Inmune a ${TYPE_META[thr.type].name}`)
      } else if (mult < 1) {
        score += 3
        resistsThreats.push(thr.type)
        reasons.push(`Resiste ${TYPE_META[thr.type].name}`)
      } else if (mult > 1) {
        // Penalty for adding another vulnerability to an already critical threat
        score -= 3
      }
    }

    // Offensive evaluation for coverage gaps
    for (const g of gaps) {
      const canHit = [...candAtkTypes].some((a) => typeMultiplier(a, g, gen) > 1)
      if (canHit) {
        score += 2
        coversGaps.push(g)
        reasons.push(`Cubre ${TYPE_META[g].name}`)
      }
    }

    // Small bonus for BST
    score += bst(cand.stats) / 300

    if (score <= 1) return null

    return {
      pokemon: cand,
      source,
      score,
      reasons: reasons.slice(0, 3),
      resistsThreats,
      coversGaps,
    }
  }

  // 1. Calculate PC Recommendations
  const pcCandidates = pcKeys
    .map((k) => DEX_BY_KEY[k])
    .filter((p): p is Pokemon => Boolean(p))
    .map((p) => scoreCandidate(p, 'pc'))
    .filter((r): r is PokemonRecommendation => Boolean(r))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  // 2. Calculate Wild Meta Recommendations (from Dex)
  // Only recommend fully evolved Pokemon or competitive staples with BST >= 460
  const wildCandidates = POKEDEX
    .filter((p) => {
      if (teamKeys.has(p.key)) return false
      const lastStage = p.evolution[p.evolution.length - 1]
      const isFinal = lastStage ? lastStage.some((n) => n.dexKey === p.key || n.slug === p.slug) : true
      const hasBulkOrPower = bst(p.stats) >= 460
      return isFinal || hasBulkOrPower
    })
    .map((p) => scoreCandidate(p, 'wild'))
    .filter((r): r is PokemonRecommendation => Boolean(r))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return {
    rows,
    threats,
    suggestions,
    gaps,
    gapFixers,
    pcRecommendations: pcCandidates,
    wildRecommendations: wildCandidates,
  }
}

export function formatMult(m: number) {
  if (m === 0.25) return '¼'
  if (m === 0.5) return '½'
  return `${m}`
}

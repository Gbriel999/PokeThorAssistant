import { typesFor } from './analysis'
import { MOVES } from './moves'
import type { Pokemon } from './pokemon'
import { TYPE_META, typeMultiplier, type PokeType } from './types'

export type MatchupResult = {
  pokemon: Pokemon
  stars: 1 | 2 | 3 | 4 | 5
  score: number
  verdict: string
  tone: 'counter' | 'advantage' | 'neutral' | 'disadvantage' | 'danger'
  offensiveSummary: string
  defensiveSummary: string
  bestMoveName?: string
  faster: boolean
}

function multAgainst(atk: PokeType, defTypes: PokeType[], gen: number): number {
  return defTypes.reduce((acc, d) => acc * typeMultiplier(atk, d, gen), 1)
}

function checkAbilityImmunity(p: Pokemon, atkType: PokeType): boolean {
  if (atkType === 'ground' && (p.groundImmuneAbility || p.types.includes('flying'))) return true
  const abs = p.abilities.map((a) => a.name.toLowerCase())
  if (atkType === 'water' && abs.some((a) => a.includes('absorbe agua') || a.includes('piel seca') || a.includes('colector'))) return true
  if (atkType === 'fire' && abs.some((a) => a.includes('absorbe fuego') || a.includes('cuerpo horneado'))) return true
  if (atkType === 'electric' && (p.types.includes('ground') || abs.some((a) => a.includes('absorbe elec') || a.includes('electromotor') || a.includes('pararrayos')))) return true
  if (atkType === 'grass' && abs.some((a) => a.includes('herbívoro'))) return true
  return false
}

export function evaluateMatchup(pokemon: Pokemon, rival: Pokemon, gen: number): MatchupResult {
  const myTypes = typesFor(pokemon, gen)
  const rivalTypes = typesFor(rival, gen)

  // 1. Offensive analysis:
  // Check our STAB attacks against rival
  let maxOffensive = 1
  let bestOffensiveType: PokeType = myTypes[0]

  for (const t of myTypes) {
    if (checkAbilityImmunity(rival, t)) continue
    const mult = multAgainst(t, rivalTypes, gen)
    if (mult > maxOffensive) {
      maxOffensive = mult
      bestOffensiveType = t
    }
  }

  // Also check our active build moves if any coverage move hits harder
  let bestMoveName: string | undefined
  const defaultBuild = pokemon.builds[0]
  if (defaultBuild) {
    for (const moveId of defaultBuild.moves) {
      const move = MOVES[moveId]
      if (move && move.category !== 'status') {
        if (checkAbilityImmunity(rival, move.type)) continue
        const mult = multAgainst(move.type, rivalTypes, gen)
        if (mult > maxOffensive) {
          maxOffensive = mult
          bestOffensiveType = move.type
          bestMoveName = move.name
        }
      }
    }
  }

  // 2. Defensive analysis:
  // Check rival STAB against us
  let maxRivalDamage = 1
  let worstRivalType: PokeType = rivalTypes[0]

  for (const rt of rivalTypes) {
    if (checkAbilityImmunity(pokemon, rt)) {
      // Immune by typing or ability
      continue
    }
    const mult = multAgainst(rt, myTypes, gen)
    if (mult > maxRivalDamage) {
      maxRivalDamage = mult
      worstRivalType = rt
    }
  }

  // Check if we resist or are immune to all rival STABs
  const resistsAllRivalStab = rivalTypes.every((rt) => {
    if (checkAbilityImmunity(pokemon, rt)) return true
    return multAgainst(rt, myTypes, gen) <= 0.5
  })

  // 3. Speed comparison
  const faster = pokemon.stats.spe >= rival.stats.spe

  // 4. Calculate star rating (1 to 5)
  // Baseline score = 3
  let score = 3.0

  // Offensive additions:
  if (maxOffensive >= 4) {
    score += 1.8
  } else if (maxOffensive >= 2) {
    score += 0.8
  } else if (maxOffensive <= 0.5) {
    score -= 0.8
  } else if (maxOffensive === 0) {
    score -= 1.8
  }

  // Defensive additions / deductions:
  if (resistsAllRivalStab) {
    score += 1.2
  } else if (maxRivalDamage <= 0.5) {
    score += 0.8
  }

  if (maxRivalDamage >= 4) {
    score -= 2.6
  } else if (maxRivalDamage >= 2) {
    score -= 1.2
  }

  // Speed bonus
  if (faster) {
    score += 0.3
  } else {
    score -= 0.2
  }

  // Clamp star rating to integer 1..5
  const clampedStars = Math.max(1, Math.min(5, Math.round(score))) as 1 | 2 | 3 | 4 | 5

  // Generate tactical summary text
  let verdict = 'Combate parejo'
  let tone: MatchupResult['tone'] = 'neutral'

  if (clampedStars === 5) {
    verdict = '¡COUNTER PERFECTO!'
    tone = 'counter'
  } else if (clampedStars === 4) {
    verdict = 'Ventaja táctica clara'
    tone = 'advantage'
  } else if (clampedStars === 3) {
    verdict = 'Encuentro neutro'
    tone = 'neutral'
  } else if (clampedStars === 2) {
    verdict = 'Desventaja de tipos'
    tone = 'disadvantage'
  } else {
    verdict = '¡PELIGRO! No sacar'
    tone = 'danger'
  }

  const offensiveSummary =
    maxOffensive >= 4
      ? `Daño crítico x4 con ${TYPE_META[bestOffensiveType]?.name ?? bestOffensiveType}`
      : maxOffensive >= 2
        ? `Supereficaz x2 con ${TYPE_META[bestOffensiveType]?.name ?? bestOffensiveType}`
        : maxOffensive <= 0.5
          ? `Tus ataques son poco eficaces (${maxOffensive}x)`
          : `Daño neutro (1x)`

  const defensiveSummary =
    maxRivalDamage >= 4
      ? `Vulnerable x4 ante ${TYPE_META[worstRivalType]?.name ?? worstRivalType}`
      : maxRivalDamage >= 2
        ? `Recibe daño x2 de ${TYPE_META[worstRivalType]?.name ?? worstRivalType}`
        : resistsAllRivalStab
          ? `Resistes todos sus ataques STAB`
          : maxRivalDamage <= 0.5
            ? `Resiste sus golpes (${maxRivalDamage}x)`
            : `Daño recibido estándar`

  return {
    pokemon,
    stars: clampedStars,
    score,
    verdict,
    tone,
    offensiveSummary,
    defensiveSummary,
    bestMoveName,
    faster,
  }
}

export function rankTeamAgainstRival(team: Pokemon[], rival: Pokemon, gen: number): MatchupResult[] {
  return team
    .map((p) => evaluateMatchup(p, rival, gen))
    .sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars
      return b.score - a.score
    })
}

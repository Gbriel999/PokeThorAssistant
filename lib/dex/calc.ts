import type { StatKey, Stats } from './pokemon'

export type GenerationNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type GenerationInsignia = {
  gen: GenerationNumber
  label: string
  name: string
  dexNumber: number
  dexKey: string
  color: string
}

export const GENERATION_INSIGNIAS: GenerationInsignia[] = [
  { gen: 1, label: 'G1', name: 'Charizard', dexNumber: 6, dexKey: 'charizard', color: '#ff7744' },
  { gen: 2, label: 'G2', name: 'Typhlosion', dexNumber: 157, dexKey: 'typhlosion', color: '#f59e0b' },
  { gen: 3, label: 'G3', name: 'Blaziken', dexNumber: 257, dexKey: 'blaziken', color: '#ef4444' },
  { gen: 4, label: 'G4', name: 'Infernape', dexNumber: 392, dexKey: 'infernape', color: '#f97316' },
  { gen: 5, label: 'G5', name: 'Serperior', dexNumber: 497, dexKey: 'serperior', color: '#10b981' },
  { gen: 6, label: 'G6', name: 'Greninja', dexNumber: 658, dexKey: 'greninja', color: '#3b82f6' },
  { gen: 7, label: 'G7', name: 'Decidueye', dexNumber: 724, dexKey: 'decidueye', color: '#14b8a6' },
  { gen: 8, label: 'G8', name: 'Cinderace', dexNumber: 815, dexKey: 'cinderace', color: '#ec4899' },
  { gen: 9, label: 'G9', name: 'Meowscarada', dexNumber: 908, dexKey: 'meowscarada', color: '#22c55e' },
]

export function getGenForDexNumber(dexNum: number): number {
  if (dexNum <= 0) return 1
  if (dexNum <= 151) return 1
  if (dexNum <= 251) return 2
  if (dexNum <= 386) return 3
  if (dexNum <= 493) return 4
  if (dexNum <= 649) return 5
  if (dexNum <= 721) return 6
  if (dexNum <= 809) return 7
  if (dexNum <= 905) return 8
  return 9
}

export function calculateActualStat(
  stat: StatKey,
  base: number,
  iv: number,
  ev: number,
  level = 50,
  natureMult = 1.0
): number {
  const safeIv = Math.max(0, Math.min(31, Math.floor(iv || 0)))
  const safeEv = Math.max(0, Math.min(252, Math.floor(ev || 0)))
  const safeLevel = Math.max(1, Math.min(100, Math.floor(level || 50)))

  if (stat === 'hp') {
    if (base === 1) return 1 // Shedinja
    return Math.floor(((2 * base + safeIv + Math.floor(safeEv / 4)) * safeLevel) / 100) + safeLevel + 10
  }

  const raw = Math.floor(((2 * base + safeIv + Math.floor(safeEv / 4)) * safeLevel) / 100) + 5
  return Math.floor(raw * natureMult)
}

export type NatureEntry = {
  name: string
  nameEs: string
  plus?: StatKey
  minus?: StatKey
}

export const COMPETITIVE_NATURES: NatureEntry[] = [
  { name: 'Adamant', nameEs: 'Firme', plus: 'atk', minus: 'spa' },
  { name: 'Jolly', nameEs: 'Alegre', plus: 'spe', minus: 'spa' },
  { name: 'Modest', nameEs: 'Modesta', plus: 'spa', minus: 'atk' },
  { name: 'Timid', nameEs: 'Miedosa', plus: 'spe', minus: 'atk' },
  { name: 'Bold', nameEs: 'Osada', plus: 'def', minus: 'atk' },
  { name: 'Impish', nameEs: 'Agitada', plus: 'def', minus: 'spa' },
  { name: 'Calm', nameEs: 'Serena', plus: 'spd', minus: 'atk' },
  { name: 'Careful', nameEs: 'Cauta', plus: 'spd', minus: 'spa' },
  { name: 'Relaxed', nameEs: 'Plácida', plus: 'def', minus: 'spe' },
  { name: 'Sassy', nameEs: 'Grosera', plus: 'spd', minus: 'spe' },
  { name: 'Brave', nameEs: 'Audaz', plus: 'atk', minus: 'spe' },
  { name: 'Quiet', nameEs: 'Mansa', plus: 'spa', minus: 'spe' },
  { name: 'Hasty', nameEs: 'Activa', plus: 'spe', minus: 'def' },
  { name: 'Naive', nameEs: 'Ingenua', plus: 'spe', minus: 'spd' },
  { name: 'Hardy', nameEs: 'Fuerte' },
]

export function getNatureMultiplier(natureName: string | undefined, stat: StatKey): number {
  if (!natureName) return 1.0
  const normalized = natureName.trim().toLowerCase()
  const found = COMPETITIVE_NATURES.find(
    (n) => n.name.toLowerCase() === normalized || n.nameEs.toLowerCase() === normalized
  )
  if (!found || !found.plus || !found.minus) return 1.0
  if (found.plus === stat && found.minus === stat) return 1.0
  if (found.plus === stat) return 1.1
  if (found.minus === stat) return 0.9
  return 1.0
}

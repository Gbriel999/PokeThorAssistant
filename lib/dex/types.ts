export const TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type PokeType = (typeof TYPES)[number]

export const TYPE_META: Record<PokeType, { name: string; short: string; color: string }> = {
  normal: { name: 'Normal', short: 'NOR', color: '#A8A77A' },
  fire: { name: 'Fuego', short: 'FUE', color: '#EE8130' },
  water: { name: 'Agua', short: 'AGU', color: '#6390F0' },
  electric: { name: 'Eléctrico', short: 'ELÉ', color: '#F7D02C' },
  grass: { name: 'Planta', short: 'PLA', color: '#7AC74C' },
  ice: { name: 'Hielo', short: 'HIE', color: '#96D9D6' },
  fighting: { name: 'Lucha', short: 'LUC', color: '#C22E28' },
  poison: { name: 'Veneno', short: 'VEN', color: '#A33EA1' },
  ground: { name: 'Tierra', short: 'TIE', color: '#E2BF65' },
  flying: { name: 'Volador', short: 'VOL', color: '#A98FF3' },
  psychic: { name: 'Psíquico', short: 'PSÍ', color: '#F95587' },
  bug: { name: 'Bicho', short: 'BIC', color: '#A6B91A' },
  rock: { name: 'Roca', short: 'ROC', color: '#B6A136' },
  ghost: { name: 'Fantasma', short: 'FAN', color: '#735797' },
  dragon: { name: 'Dragón', short: 'DRA', color: '#6F35FC' },
  dark: { name: 'Siniestro', short: 'SIN', color: '#705746' },
  steel: { name: 'Acero', short: 'ACE', color: '#B7B7CE' },
  fairy: { name: 'Hada', short: 'HAD', color: '#D685AD' },
}

export const typeIconUrl = (t: PokeType) =>
  `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t}.svg`

type Row = Partial<Record<PokeType, number>>

const CHART: Record<PokeType, Row> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
}

/** Multiplier of an attacking type vs a single defending type, honoring pre-Gen VI rules. */
export function typeMultiplier(atk: PokeType, def: PokeType, gen: number): number {
  if (gen < 6 && (atk === 'fairy' || def === 'fairy')) return 1
  if (gen < 6 && def === 'steel' && (atk === 'ghost' || atk === 'dark')) return 0.5
  return CHART[atk][def] ?? 1
}

export function typesForGen(gen: number): PokeType[] {
  return gen < 6 ? TYPES.filter((t) => t !== 'fairy') : [...TYPES]
}

const GEN3_PHYSICAL: PokeType[] = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
]

export function isPhysicalByTypeGen3(t: PokeType) {
  return GEN3_PHYSICAL.includes(t)
}

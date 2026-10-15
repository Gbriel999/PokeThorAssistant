import { Dex } from '@pkmn/dex'
import { ITEMS, type Item } from './items'
import { MOVES, type MoveId } from './moves'
import type { PokeType } from './types'

export type StatKey = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe'
export type Stats = Record<StatKey, number>

export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'PS',
  atk: 'ATQ',
  def: 'DEF',
  spa: 'ATE',
  spd: 'DFE',
  spe: 'VEL',
}

export type Ability = { name: string; desc: string; hidden?: boolean }

export type Build = {
  id: string
  label: string
  moves: [MoveId, MoveId, MoveId, MoveId]
  item: Item
  nature: { name: string; plus: StatKey; minus: StatKey }
  evs: Partial<Stats>
  tip: string
}

export type EvoNode = {
  name: string
  slug: string
  iconId: number
  condition?: string
  itemId?: string
  dexKey?: string
}

export type LearnEntry = { level: string; move: MoveId; key?: boolean }

export type Pokemon = {
  key: string
  dex: number
  gen: number
  name: string
  slug: string
  iconId: number
  species: string
  types: PokeType[]
  legacyTypes?: PokeType[]
  abilities: Ability[]
  groundImmuneAbility?: string
  stats: Stats
  builds: Build[]
  evolution: EvoNode[][]
  learnsetSource: string
  learnset: LearnEntry[]
}

// Translations for major ability names
const ABILITY_NAMES_ES: Record<string, string> = {
  'Overgrow': 'Espesura',
  'Blaze': 'Mar Llamas',
  'Torrent': 'Torrente',
  'Intimidate': 'Intimidación',
  'Static': 'Elec. Estática',
  'Levitate': 'Levitación',
  'Pressure': 'Presión',
  'Chlorophyll': 'Clorofila',
  'Rough Skin': 'Piel Tosca',
  'Protean': 'Mutatipo',
  'Magic Guard': 'Muro Mágico',
  'Unaware': 'Ignorante',
  'Natural Cure': 'Cura Natural',
  'Regenerator': 'Regeneración',
  'Sand Stream': 'Chorro Arena',
  'Sand Rush': 'Ímpetu Arena',
  'Iron Barbs': 'Punta Acero',
  'Guts': 'Agallas',
  'Sheer Force': 'Potencia Bruta',
  'Technician': 'Experto',
  'Moxie': 'Autoestima',
  'Speed Boost': 'Impulso',
  'Huge Power': 'Potencia',
  'Adaptability': 'Adaptable',
  'Prankster': 'Bromista',
  'Drizzle': 'Llovizna',
  'Drought': 'Sequía',
  'Disguise': 'Disfraz',
  'Stance Change': 'Cambio Táctico',
  'Beast Boost': 'Ultraimpulso',
  'Synchronize': 'Sincronía',
  'Trace': 'Rastro',
  'Cursed Body': 'Cuerpo Maldito',
  'Inner Focus': 'Foco Interno',
  'Steadfast': 'Impasible',
  'Justified': 'Justiciero',
  'Multiscale': 'Compensación',
  'Clear Body': 'Cuerpo Puro',
  'Mold Breaker': 'Rompemoldes',
  'Flame Body': 'Cuerpo Llama',
  'Gale Wings': 'Alas Vendaval',
  'Merciless': 'Ensañamiento',
  'Contrary': 'Respondón',
  'Poison Heal': 'Antídoto',
  'Serene Grace': 'Dicha',
  'Mirror Armor': 'Coraza Reflejo',
}

// STAB attack mappings per type
const STAB_PHYSICAL: Record<PokeType, MoveId> = {
  normal: 'slash',
  fire: 'flare-blitz',
  water: 'waterfall',
  electric: 'wild-charge',
  grass: 'wood-hammer',
  ice: 'icicle-crash',
  fighting: 'close-combat',
  poison: 'poison-jab',
  ground: 'earthquake',
  flying: 'brave-bird',
  psychic: 'zen-headbutt',
  bug: 'x-scissor',
  rock: 'stone-edge',
  ghost: 'shadow-claw',
  dragon: 'dragon-claw',
  dark: 'knock-off',
  steel: 'iron-head',
  fairy: 'play-rough',
}

const STAB_SPECIAL: Record<PokeType, MoveId> = {
  normal: 'hyper-beam',
  fire: 'flamethrower',
  water: 'hydro-pump',
  electric: 'thunderbolt',
  grass: 'energy-ball',
  ice: 'ice-beam',
  fighting: 'aura-sphere',
  poison: 'sludge-bomb',
  ground: 'earth-power',
  flying: 'air-slash',
  psychic: 'psychic',
  bug: 'bug-buzz',
  rock: 'power-gem',
  ghost: 'shadow-ball',
  dragon: 'draco-meteor',
  dark: 'dark-pulse',
  steel: 'flash-cannon',
  fairy: 'moonblast',
}

// Hand-crafted curated builds for staples
const CURATED_BUILDS: Record<string, Partial<Pokemon>> = {
  garchomp: {
    builds: [
      {
        id: 'sd',
        label: 'Danza Espada',
        moves: ['swords-dance', 'earthquake', 'scale-shot', 'fire-fang'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, def: 4, spe: 252 },
        tip: 'Sube +2 Atq y barre; Ráfaga Escamas además sube su Velocidad.',
      },
      {
        id: 'scarf',
        label: 'Choice Scarf',
        moves: ['outrage', 'earthquake', 'stone-edge', 'fire-fang'],
        item: ITEMS.choiceScarf,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, spd: 4, spe: 252 },
        tip: 'Revenge killer: supera a amenazas rápidas sin necesitar setup.',
      },
    ],
  },
  scizor: {
    builds: [
      {
        id: 'band',
        label: 'Choice Band',
        moves: ['bullet-punch', 'u-turn', 'knock-off', 'superpower'],
        item: ITEMS.choiceBand,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { hp: 248, atk: 252, spd: 8 },
        tip: 'Puño Bala + Experto: prioridad brutal para rematar.',
      },
      {
        id: 'sd',
        label: 'Danza Espada',
        moves: ['swords-dance', 'bullet-punch', 'knock-off', 'roost'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { hp: 248, atk: 252, spd: 8 },
        tip: 'Aprovecha cambios forzados para subir y barrer con prioridad.',
      },
    ],
  },
  'rotom-wash': {
    iconId: 10009,
    groundImmuneAbility: 'Levitación',
    builds: [
      {
        id: 'pivot',
        label: 'Pivote Defensivo',
        moves: ['hydro-pump', 'volt-switch', 'will-o-wisp', 'pain-split'],
        item: ITEMS.leftovers,
        nature: { name: 'Osada', plus: 'def', minus: 'atk' },
        evs: { hp: 252, def: 236, spe: 20 },
        tip: 'Quema a atacantes físicos y pivota con Voltiocambio.',
      },
    ],
  },
  tyranitar: {
    builds: [
      {
        id: 'dd',
        label: 'Danza Dragón',
        moves: ['dragon-dance', 'stone-edge', 'crunch', 'earthquake'],
        item: ITEMS.weaknessPolicy,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, spd: 4, spe: 252 },
        tip: 'La arena sube su DFE x1.5: aguanta y activa el Seguro.',
      },
    ],
  },
  gardevoir: {
    legacyTypes: ['psychic'],
    builds: [
      {
        id: 'cm',
        label: 'Paz Mental',
        moves: ['calm-mind', 'moonblast', 'psyshock', 'mystical-fire'],
        item: ITEMS.leftovers,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { spa: 252, spd: 4, spe: 252 },
        tip: 'Psicocarga golpea la Defensa física de las murallas especiales.',
      },
    ],
  },
  gengar: {
    builds: [
      {
        id: 'np',
        label: 'Maquinación',
        moves: ['nasty-plot', 'shadow-ball', 'sludge-wave', 'focus-blast'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { spa: 252, spd: 4, spe: 252 },
        tip: 'Fantasma + Lucha: cobertura casi perfecta tras +2.',
      },
    ],
  },
  lucario: {
    builds: [
      {
        id: 'sd',
        label: 'Danza Espada',
        moves: ['swords-dance', 'close-combat', 'meteor-mash', 'extreme-speed'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { atk: 252, spd: 4, spe: 252 },
        tip: 'Velocidad Extrema a +2 limpia equipos debilitados.',
      },
    ],
  },
  dragonite: {
    builds: [
      {
        id: 'dd',
        label: 'Danza Dragón',
        moves: ['dragon-dance', 'extreme-speed', 'earthquake', 'fire-punch'],
        item: ITEMS.lumBerry,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { atk: 252, spd: 4, spe: 252 },
        tip: 'Compensación + Ziuela: setup casi garantizado.',
      },
    ],
  },
  metagross: {
    builds: [
      {
        id: 'agility',
        label: 'Agilidad Ofensiva',
        moves: ['agility', 'meteor-mash', 'earthquake', 'bullet-punch'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { atk: 252, def: 4, spe: 252 },
        tip: 'Tras una Agilidad supera a todo el metagame con 135 de ataque base.',
      },
    ],
  },
  excadrill: {
    builds: [
      {
        id: 'sand',
        label: 'Barredor de Arena',
        moves: ['swords-dance', 'earthquake', 'iron-head', 'rock-slide'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { atk: 252, def: 4, spe: 252 },
        tip: 'Bajo tormenta de arena duplica su velocidad y barre.',
      },
    ],
  },
  ferrothorn: {
    builds: [
      {
        id: 'wall',
        label: 'Muralla & Drenadoras',
        moves: ['leech-seed', 'stealth-rock', 'spikes', 'gyro-ball'],
        item: ITEMS.leftovers,
        nature: { name: 'Plácida', plus: 'def', minus: 'spe' },
        evs: { hp: 252, def: 88, spd: 168 },
        tip: 'Inmune a Tóxico y Drenadoras; Giro Bola hace daño masivo con mínima velocidad.',
      },
    ],
  },
  volcarona: {
    builds: [
      {
        id: 'quiver',
        label: 'Danza Aleteo',
        moves: ['quiver-dance', 'flamethrower', 'bug-buzz', 'giga-drain'],
        item: ITEMS.heavyDutyBoots,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { spa: 252, spd: 4, spe: 252 },
        tip: 'Danza Aleteo sube At. Esp, Def. Esp y Vel a la vez.',
      },
    ],
  },
  greninja: {
    builds: [
      {
        id: 'protean',
        label: 'Mutatipo Ofensivo',
        moves: ['hydro-pump', 'dark-pulse', 'ice-beam', 'u-turn'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { spa: 252, spd: 4, spe: 252 },
        tip: 'Mutatipo otorga STAB a todos sus ataques.',
      },
    ],
  },
  aegislash: {
    builds: [
      {
        id: 'stance',
        label: 'Danza Espada & Prioridad',
        moves: ['swords-dance', 'shadow-sneak', 'iron-head', 'kings-shield'],
        item: ITEMS.leftovers,
        nature: { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: { hp: 252, atk: 252, spd: 4 },
        tip: 'Usa Escudo Real para tanquear con 140 Def y remata con Sombra Vil.',
      },
    ],
  },
  mimikyu: {
    builds: [
      {
        id: 'disguise',
        label: 'Disfraz & Danza Espada',
        moves: ['swords-dance', 'play-rough', 'shadow-claw', 'shadow-sneak'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, def: 4, spe: 252 },
        tip: 'Disfraz garantiza 1 turno gratis de Danza Espada.',
      },
    ],
  },
  corviknight: {
    builds: [
      {
        id: 'defog',
        label: 'Pivote & Despejar',
        moves: ['defog', 'roost', 'u-turn', 'brave-bird'],
        item: ITEMS.leftovers,
        nature: { name: 'Agitada', plus: 'def', minus: 'spa' },
        evs: { hp: 252, def: 252, spd: 4 },
        tip: 'Inmune a Veneno y Tierra; limpia hazards con Despejar.',
      },
    ],
  },
  chansey: {
    builds: [
      {
        id: 'eviolite',
        label: 'Muro Eviolite',
        moves: ['soft-boiled', 'toxic', 'stealth-rock', 'teleport'],
        item: ITEMS.eviolite,
        nature: { name: 'Osada', plus: 'def', minus: 'atk' },
        evs: { hp: 248, def: 252, spd: 8 },
        tip: 'Mineral Evolutivo sube su Def y DfE un 50%.',
      },
    ],
  },
  togekiss: {
    legacyTypes: ['normal', 'flying'],
    builds: [
      {
        id: 'flinch',
        label: 'Dicha & Retroceso',
        moves: ['nasty-plot', 'air-slash', 'roost', 'flamethrower'],
        item: ITEMS.leftovers,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { hp: 248, def: 8, spe: 252 },
        tip: 'Tajo Aéreo + Dicha causa 60% de retroceso al rival.',
      },
    ],
  },
  clefable: {
    legacyTypes: ['normal'],
    builds: [
      {
        id: 'magic',
        label: 'Paz Mental & Muro Mágico',
        moves: ['calm-mind', 'moonblast', 'soft-boiled', 'flamethrower'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Osada', plus: 'def', minus: 'atk' },
        evs: { hp: 252, def: 252, spa: 4 },
        tip: 'Vidasfera aumenta daño sin quitarte vida gracias a Muro Mágico.',
      },
    ],
  },
  meowscarada: {
    builds: [
      {
        id: 'lead',
        label: 'Atacante Pivot',
        moves: ['flower-trick', 'knock-off', 'u-turn', 'play-rough'],
        item: ITEMS.focusSash,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, spd: 4, spe: 252 },
        tip: 'Truco Floral siempre es golpe crítico e ignora mejoras defensivas del rival.',
      },
    ],
  },
  skeledirge: {
    builds: [
      {
        id: 'unaware',
        label: 'Muralla Ignorante',
        moves: ['torch-song', 'shadow-ball', 'earth-power', 'will-o-wisp'],
        item: ITEMS.leftovers,
        nature: { name: 'Osada', plus: 'def', minus: 'atk' },
        evs: { hp: 252, def: 252, spd: 4 },
        tip: 'Canto Ardoroso sube At. Esp +1 en cada uso e Ignorante anula el boost rival.',
      },
    ],
  },
  tinkaton: {
    builds: [
      {
        id: 'gigaton',
        label: 'Ofensivo Bulky',
        moves: ['gigaton-hammer', 'play-rough', 'knock-off', 'stealth-rock'],
        item: ITEMS.leftovers,
        nature: { name: 'Cauta', plus: 'spd', minus: 'spa' },
        evs: { hp: 252, atk: 128, spd: 128 },
        tip: 'Martillo Gigatón tiene 160 de potencia base física con acero demoledor.',
      },
    ],
  },
  greattusk: {
    builds: [
      {
        id: 'offensive',
        label: 'Booster Atacante',
        moves: ['headlong-rush', 'close-combat', 'knock-off', 'rapid-spin'],
        item: ITEMS.boosterEnergy,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, def: 4, spe: 252 },
        tip: 'Giro Rápido limpia hazards y sube +1 Velocidad para barrer con Asalto Espesura.',
      },
    ],
  },
  fluttermane: {
    builds: [
      {
        id: 'specs',
        label: 'Choice Specs',
        moves: ['moonblast', 'shadow-ball', 'mystical-fire', 'power-gem'],
        item: ITEMS.choiceSpecs,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { spa: 252, spd: 4, spe: 252 },
        tip: 'Fuerza Lunar con Gafas Elección destroza casi cualquier cambio.',
      },
    ],
  },
  gholdengo: {
    builds: [
      {
        id: 'nasty',
        label: 'Maquinación',
        moves: ['make-it-rain', 'shadow-ball', 'nasty-plot', 'recover'],
        item: ITEMS.leftovers,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { hp: 4, spa: 252, spe: 252 },
        tip: 'Cuerpo Áureo es inmune a todo movimiento de estado; Maquinación + Fiebre Dorada.',
      },
    ],
  },
  koraidon: {
    builds: [
      {
        id: 'sd',
        label: 'Danza Espada',
        moves: ['collision-course', 'dragon-claw', 'flare-blitz', 'swords-dance'],
        item: ITEMS.lifeOrb,
        nature: { name: 'Alegre', plus: 'spe', minus: 'spa' },
        evs: { atk: 252, def: 4, spe: 252 },
        tip: 'Latido Oricalco invoca sol y sube Ataque x1.33 de inmediato.',
      },
    ],
  },
  miraidon: {
    builds: [
      {
        id: 'specs',
        label: 'Choice Specs',
        moves: ['electro-drift', 'draco-meteor', 'volt-switch', 'overheat'],
        item: ITEMS.choiceSpecs,
        nature: { name: 'Miedosa', plus: 'spe', minus: 'atk' },
        evs: { spa: 252, spd: 4, spe: 252 },
        tip: 'Motor Hadrónico activa campo eléctrico y sube At. Esp x1.33.',
      },
    ],
  },
  pecharunt: {
    builds: [
      {
        id: 'toxic',
        label: 'Defensivo Físico',
        moves: ['malignant-chain', 'shadow-ball', 'nasty-plot', 'recover'],
        item: ITEMS.leftovers,
        nature: { name: 'Osada', plus: 'def', minus: 'atk' },
        evs: { hp: 252, def: 252, spe: 4 },
        tip: 'Cadena Tóxica tiene un 50% de probabilidad de envenenar gravemente.',
      },
    ],
  },
  'ursaluna-bloodmoon': {
    builds: [
      {
        id: 'calm-mind',
        label: 'Paz Mental',
        moves: ['blood-moon', 'earth-power', 'vacuum-wave', 'calm-mind'],
        item: ITEMS.leftovers,
        nature: { name: 'Modesta', plus: 'spa', minus: 'atk' },
        evs: { hp: 252, def: 4, spa: 252 },
        tip: 'Ojo Mental permite golpear a tipos Fantasma con Luna Carmesí.',
      },
    ],
  },
}

function generateBuildsForSpecies(types: PokeType[], stats: Stats, hasEvos: boolean): Build[] {
  const bulk = (stats.hp + stats.def + stats.spd) / 3
  const maxOffense = Math.max(stats.atk, stats.spa)
  const isWall = bulk > maxOffense + 8 || ((stats.def >= 95 || stats.spd >= 95) && stats.hp >= 75 && stats.spe < 85)
  const isPhysical = stats.atk >= stats.spa
  const primary = types[0] ?? 'normal'
  const secondary = types[1]

  const moves: MoveId[] = []
  const addMove = (mId: MoveId) => {
    if (mId && !moves.includes(mId) && moves.length < 4) {
      moves.push(mId)
    }
  }

  // 1. DEFENSIVE WALL ARCHETYPE (e.g. Blissey, Umbreon, Slowbro, Toxapex)
  if (isWall) {
    const isPhysDef = stats.def >= stats.spd

    if (isPhysical) {
      addMove(STAB_PHYSICAL[primary])
      if (secondary) addMove(STAB_PHYSICAL[secondary])
    } else {
      addMove(STAB_SPECIAL[primary])
      if (secondary) addMove(STAB_SPECIAL[secondary])
    }

    if (types.includes('flying')) addMove('roost')
    if (types.includes('water')) addMove('scald')
    if (types.includes('fire') || types.includes('ghost')) addMove('will-o-wisp')
    addMove('toxic')
    addMove('stealth-rock')
    addMove('protect')
    addMove('knock-off')
    addMove('substitute')
    if (isPhysical) addMove(STAB_PHYSICAL[primary])
    else addMove(STAB_SPECIAL[primary])

    return [
      {
        id: 'meta-wall',
        label: isPhysDef ? 'Muralla Física' : 'Muralla Especial',
        moves: [moves[0] ?? 'toxic', moves[1] ?? 'protect', moves[2] ?? 'stealth-rock', moves[3] ?? 'knock-off'] as [MoveId, MoveId, MoveId, MoveId],
        item: hasEvos ? ITEMS.eviolite : ITEMS.leftovers,
        nature: isPhysDef
          ? (isPhysical ? { name: 'Agitada', plus: 'def', minus: 'spa' } : { name: 'Osada', plus: 'def', minus: 'atk' })
          : (isPhysical ? { name: 'Cauta', plus: 'spd', minus: 'spa' } : { name: 'Serena', plus: 'spd', minus: 'atk' }),
        evs: isPhysDef
          ? { hp: 252, def: 252, spd: 4 }
          : { hp: 252, spd: 252, def: 4 },
        tip: `Muralla defensiva: maximiza PS y ${isPhysDef ? 'Defensa' : 'Def. Esp'} (${isPhysDef ? stats.def : stats.spd}) para desgastar al rival.`,
      },
    ]
  }

  // 2. PHYSICAL ATTACKER (Sweeper vs Bulky)
  if (isPhysical) {
    addMove(STAB_PHYSICAL[primary])
    if (secondary) addMove(STAB_PHYSICAL[secondary])
    if (primary !== 'ground' && secondary !== 'ground') addMove('earthquake')
    addMove('stone-edge')
    addMove('knock-off')
    addMove(stats.spe >= 75 ? 'swords-dance' : 'close-combat')
    addMove('quick-attack')
    addMove('slash')

    const isFast = stats.spe >= 85
    return [
      {
        id: 'meta-physical',
        label: isFast ? 'Sweeper Físico' : 'Atacante Pesado',
        moves: [moves[0], moves[1], moves[2], moves[3]] as [MoveId, MoveId, MoveId, MoveId],
        item: hasEvos ? ITEMS.eviolite : isFast ? (stats.spe >= 100 ? ITEMS.lifeOrb : ITEMS.choiceBand) : ITEMS.assaultVest,
        nature: isFast
          ? (stats.spe >= 100 ? { name: 'Alegre', plus: 'spe', minus: 'spa' } : { name: 'Firme', plus: 'atk', minus: 'spa' })
          : { name: 'Firme', plus: 'atk', minus: 'spa' },
        evs: isFast
          ? { atk: 252, def: 4, spe: 252 }
          : { hp: 252, atk: 252, spd: 4 },
        tip: isFast
          ? `Velocidad ${stats.spe} y Ataque ${stats.atk}: barre con daño físico de alta potencia.`
          : `Aprovecha su Ataque base ${stats.atk} y su aguante natural para golpear fuerte.`,
      },
    ]
  }

  // 3. SPECIAL ATTACKER (Sweeper vs Bulky)
  addMove(STAB_SPECIAL[primary])
  if (secondary) addMove(STAB_SPECIAL[secondary])
  if (primary !== 'ice' && secondary !== 'ice') addMove('ice-beam')
  if (primary !== 'electric' && secondary !== 'electric') addMove('thunderbolt')
  addMove('shadow-ball')
  addMove('nasty-plot')
  addMove('focus-blast')
  addMove('psychic')

  const isFast = stats.spe >= 85
  return [
    {
      id: 'meta-special',
      label: isFast ? 'Sweeper Especial' : 'Atacante Especial',
      moves: [moves[0], moves[1], moves[2], moves[3]] as [MoveId, MoveId, MoveId, MoveId],
      item: hasEvos ? ITEMS.eviolite : isFast ? (stats.spe >= 100 ? ITEMS.lifeOrb : ITEMS.choiceSpecs) : ITEMS.assaultVest,
      nature: isFast
        ? (stats.spe >= 100 ? { name: 'Miedosa', plus: 'spe', minus: 'atk' } : { name: 'Modesta', plus: 'spa', minus: 'atk' })
        : { name: 'Modesta', plus: 'spa', minus: 'atk' },
      evs: isFast
        ? { spa: 252, spd: 4, spe: 252 }
        : { hp: 252, spa: 252, spd: 4 },
      tip: isFast
        ? `Velocidad ${stats.spe} y At. Esp ${stats.spa}: rompe murallas por el lado especial.`
        : `Aprovecha su At. Esp de ${stats.spa} e inversión en PS para aguantar y golpear.`,
    },
  ]
}

const KEY_FORMES = new Set([
  'Wash', 'Heat', 'Frost', 'Fan', 'Mow',
  'Alola', 'Galar', 'Hisui', 'Paldea',
  'Bloodmoon', 'Hero', 'Wellspring', 'Hearthflame', 'Cornerstone',
  'Origin', 'Primal', 'Crowned', 'Therian',
  'Rapid-Strike', 'Single-Strike', 'Dusk-Mane', 'Dawn-Wings', 'Ultra',
  'Attack', 'Defense', 'Speed', 'Black', 'White',
  'Mega', 'Mega-X', 'Mega-Y',
])

export function getSpriteSlug(s: { id: string; forme?: string; baseSpecies?: string; name: string }): string {
  if (s.forme) {
    const base = (s.baseSpecies || s.name).toLowerCase().replace(/[^a-z0-9]/g, '')
    const forme = s.forme.toLowerCase().replace(/[^a-z0-9]/g, '')
    return `${base}-${forme}`
  }
  return s.id
}

const allDexSpecies = Dex.species.all().filter((s) => {
  if (s.num < 1 || s.num > 1025) return false
  if (!s.forme) return true
  return KEY_FORMES.has(s.forme)
})

export const POKEDEX: Pokemon[] = allDexSpecies.map((s) => {
  const key =
    s.id === 'rotomwash'
      ? 'rotom-wash'
      : s.id === 'rotomheat'
        ? 'rotom-heat'
        : s.id === 'rotommow'
          ? 'rotom-mow'
          : s.id === 'rotomfrost'
            ? 'rotom-frost'
            : s.id === 'rotomfan'
              ? 'rotom-fan'
              : s.id === 'ursalunabloodmoon'
                ? 'ursaluna-bloodmoon'
                : s.id
  const types = s.types.map((t) => t.toLowerCase() as PokeType)
  const stats: Stats = {
    hp: s.baseStats.hp,
    atk: s.baseStats.atk,
    def: s.baseStats.def,
    spa: s.baseStats.spa,
    spd: s.baseStats.spd,
    spe: s.baseStats.spe,
  }

  const abilities: Ability[] = Object.entries(s.abilities).map(([slot, name]) => ({
    name: ABILITY_NAMES_ES[name] ?? name,
    desc: `Habilidad ${slot === 'H' ? 'oculta' : 'estándar'} de ${s.name}.`,
    hidden: slot === 'H',
  }))

  const hasEvos = Boolean(s.evos && s.evos.length > 0)
  const curated = CURATED_BUILDS[key]

  const builds = curated?.builds ?? generateBuildsForSpecies(types, stats, hasEvos)

  // Evolution tree construction
  const evolution: EvoNode[][] = []
  if (s.prevo) {
    const preSpecies = Dex.species.get(s.prevo)
    evolution.push([{ name: preSpecies.name, slug: preSpecies.id, iconId: preSpecies.num, dexKey: preSpecies.id }])
  }
  evolution.push([{ name: s.name, slug: s.id, iconId: s.num, dexKey: s.id }])
  if (s.evos && s.evos.length > 0) {
    evolution.push(
      s.evos.map((evoName) => {
        const evoSpecies = Dex.species.get(evoName)
        return {
          name: evoSpecies.name,
          slug: evoSpecies.id,
          iconId: evoSpecies.num,
          condition: 'Evolución',
          dexKey: evoSpecies.id,
        }
      }),
    )
  }

  const isLevitate = Object.values(s.abilities).some((a) => a.toLowerCase() === 'levitate')

  return {
    key,
    dex: s.num,
    gen: s.gen,
    name: s.name,
    slug: getSpriteSlug(s),
    iconId: curated?.iconId ?? s.num,
    species: `Pokémon ${s.name}`,
    types,
    legacyTypes: curated?.legacyTypes,
    abilities,
    groundImmuneAbility: isLevitate ? 'Levitación' : undefined,
    stats,
    builds,
    evolution,
    learnsetSource: `Gen ${s.gen} · Datos Oficiales`,
    learnset: [
      { level: '1', move: builds[0].moves[0], key: true },
      { level: '15', move: builds[0].moves[1], key: true },
      { level: '30', move: builds[0].moves[2], key: true },
      { level: 'MT', move: builds[0].moves[3], key: true },
    ],
  }
})

export const DEX_BY_KEY: Record<string, Pokemon> = Object.fromEntries(POKEDEX.map((p) => [p.key, p]))

export const aniSpriteUrl = (slug: string) => `https://play.pokemonshowdown.com/sprites/ani/${slug}.gif`
export const boxIconUrl = (id: number) => {
  if (id <= 898) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${id}.png`
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
export const itemSpriteUrl = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${id}.png`

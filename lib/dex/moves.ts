import { isPhysicalByTypeGen3, type PokeType } from './types'

export type MoveCategory = 'physical' | 'special' | 'status'

export type Move = {
  name: string
  type: PokeType
  category: MoveCategory
  power: number | null
  accuracy: number | null
  pp: number
}

const m = (
  name: string,
  type: PokeType,
  category: MoveCategory,
  power: number | null,
  accuracy: number | null,
  pp: number,
): Move => ({ name, type, category, power, accuracy, pp })

export const MOVES = {
  // Ground
  'earthquake': m('Terremoto', 'ground', 'physical', 100, 100, 10),
  'earth-power': m('Tierra Viva', 'ground', 'special', 90, 100, 10),
  'headlong-rush': m('Asalto Espesura', 'ground', 'physical', 120, 100, 5),
  'scorching-sands': m('Arenas Ardientes', 'ground', 'special', 70, 100, 10),
  'spikes': m('Púas', 'ground', 'status', null, null, 20),
  'dig': m('Excavar', 'ground', 'physical', 80, 100, 10),
  'bone-rush': m('Ataque Óseo', 'ground', 'physical', 25, 90, 10),

  // Dragon
  'draco-meteor': m('Cometa Draco', 'dragon', 'special', 130, 90, 5),
  'dragon-claw': m('Garra Dragón', 'dragon', 'physical', 80, 100, 15),
  'outrage': m('Enfado', 'dragon', 'physical', 120, 100, 10),
  'dragon-dance': m('Danza Dragón', 'dragon', 'status', null, null, 20),
  'scale-shot': m('Ráfaga Escamas', 'dragon', 'physical', 25, 90, 20),
  'dragon-tail': m('Cola Dragón', 'dragon', 'physical', 60, 90, 10),
  'dragon-pulse': m('Pulso Dragón', 'dragon', 'special', 85, 100, 10),
  'dragon-rush': m('Carga Dragón', 'dragon', 'physical', 100, 75, 10),
  'twister': m('Ciclón', 'dragon', 'special', 40, 100, 20),

  // Water
  'hydro-pump': m('Hidrobomba', 'water', 'special', 110, 80, 5),
  'scald': m('Escaldar', 'water', 'special', 80, 100, 15),
  'surf': m('Surf', 'water', 'special', 90, 100, 15),
  'waterfall': m('Cascada', 'water', 'physical', 80, 100, 15),
  'aqua-jet': m('Acua Jet', 'water', 'physical', 40, 100, 20),
  'flip-turn': m('Viraje', 'water', 'physical', 60, 100, 20),
  'liquidation': m('Hidroariete', 'water', 'physical', 85, 100, 10),

  // Fire
  'flamethrower': m('Lanzallamas', 'fire', 'special', 90, 100, 15),
  'fire-blast': m('Llamarada', 'fire', 'special', 110, 85, 5),
  'flare-blitz': m('Envite Ígneo', 'fire', 'physical', 120, 100, 15),
  'fire-punch': m('Puño Fuego', 'fire', 'physical', 75, 100, 15),
  'fire-fang': m('Colmillo Ígneo', 'fire', 'physical', 65, 95, 15),
  'will-o-wisp': m('Fuego Fatuo', 'fire', 'status', null, 85, 15),
  'mystical-fire': m('Llama Embrujada', 'fire', 'special', 75, 100, 10),
  'lava-plume': m('Humareda', 'fire', 'special', 80, 100, 15),
  'overheat': m('Sofoco', 'fire', 'special', 130, 90, 5),
  'torch-song': m('Canto Ardoroso', 'fire', 'special', 80, 100, 10),

  // Grass
  'flower-trick': m('Truco Floral', 'grass', 'physical', 70, null, 10),
  'giga-drain': m('Gigadrenado', 'grass', 'special', 75, 100, 10),
  'energy-ball': m('Energibola', 'grass', 'special', 90, 100, 10),
  'leaf-storm': m('Lluevehojas', 'grass', 'special', 130, 90, 5),
  'wood-hammer': m('Mazazo', 'grass', 'physical', 120, 100, 15),
  'spore': m('Espora', 'grass', 'status', null, 100, 15),
  'leech-seed': m('Drenadoras', 'grass', 'status', null, 90, 10),
  'synthesis': m('Síntesis', 'grass', 'status', null, null, 5),

  // Electric
  'thunderbolt': m('Rayo', 'electric', 'special', 90, 100, 15),
  'volt-switch': m('Voltiocambio', 'electric', 'special', 70, 100, 20),
  'electro-drift': m('Electroderrape', 'electric', 'special', 100, 100, 5),
  'thunder-wave': m('Onda Trueno', 'electric', 'status', null, 90, 20),
  'discharge': m('Chispazo', 'electric', 'special', 80, 100, 15),
  'wild-charge': m('Voltio Cruel', 'electric', 'physical', 90, 100, 15),
  'thunder': m('Trueno', 'electric', 'special', 110, 70, 10),
  'thunder-shock': m('Impactrueno', 'electric', 'special', 40, 100, 30),
  'shock-wave': m('Onda Voltio', 'electric', 'special', 60, null, 20),

  // Fighting
  'close-combat': m('A Bocajarro', 'fighting', 'physical', 120, 100, 5),
  'collision-course': m('Choque Colisión', 'fighting', 'physical', 100, 100, 5),
  'superpower': m('Fuerza Bruta', 'fighting', 'physical', 120, 100, 5),
  'aura-sphere': m('Esfera Aural', 'fighting', 'special', 80, null, 20),
  'focus-blast': m('Onda Certera', 'fighting', 'special', 120, 70, 5),
  'drain-punch': m('Puño Drenaje', 'fighting', 'physical', 75, 100, 10),
  'mach-punch': m('Ultrapuño', 'fighting', 'physical', 40, 100, 30),
  'vacuum-wave': m('Onda Vacío', 'fighting', 'special', 40, 100, 30),
  'body-press': m('Plancha Corporal', 'fighting', 'physical', 80, 100, 10),
  'force-palm': m('Palmeo', 'fighting', 'physical', 60, 100, 10),
  'bulk-up': m('Corpulencia', 'fighting', 'status', null, null, 20),

  // Steel
  'bullet-punch': m('Puño Bala', 'steel', 'physical', 40, 100, 30),
  'iron-head': m('Cabeza de Hierro', 'steel', 'physical', 80, 100, 15),
  'gigaton-hammer': m('Martillo Gigatón', 'steel', 'physical', 160, 100, 5),
  'make-it-rain': m('Fiebre Dorada', 'steel', 'special', 120, 100, 5),
  'flash-cannon': m('Foco Resplandor', 'steel', 'special', 80, 100, 10),
  'meteor-mash': m('Puño Meteoro', 'steel', 'physical', 90, 90, 10),
  'heavy-slam': m('Cuerpo Pesado', 'steel', 'physical', null, 100, 10),
  'gyro-ball': m('Giro Bola', 'steel', 'physical', null, 100, 5),
  'metal-claw': m('Garra Metal', 'steel', 'physical', 50, 95, 35),
  'iron-defense': m('Defensa Férrea', 'steel', 'status', null, null, 15),
  'kings-shield': m('Escudo Real', 'steel', 'status', null, null, 10),

  // Fairy
  'moonblast': m('Fuerza Lunar', 'fairy', 'special', 95, 100, 15),
  'dazzling-gleam': m('Brillo Mágico', 'fairy', 'special', 80, 100, 10),
  'play-rough': m('Carantoña', 'fairy', 'physical', 90, 90, 10),
  'spirit-break': m('Choque Anímico', 'fairy', 'physical', 75, 100, 15),

  // Dark
  'knock-off': m('Desarme', 'dark', 'physical', 65, 100, 20),
  'dark-pulse': m('Pulso Umbrío', 'dark', 'special', 80, 100, 15),
  'crunch': m('Triturar', 'dark', 'physical', 80, 100, 15),
  'sucker-punch': m('Golpe Bajo', 'dark', 'physical', 70, 100, 5),
  'nasty-plot': m('Maquinación', 'dark', 'status', null, null, 20),
  'taunt': m('Mofa', 'dark', 'status', null, 100, 20),
  'foul-play': m('Juego Sucio', 'dark', 'physical', 95, 100, 15),
  'night-slash': m('Tajo Umbrío', 'dark', 'physical', 70, 100, 15),
  'parting-shot': m('Última Palabra', 'dark', 'status', null, 100, 20),

  // Ghost
  'shadow-ball': m('Bola Sombra', 'ghost', 'special', 80, 100, 15),
  'shadow-claw': m('Garra Umbría', 'ghost', 'physical', 70, 100, 15),
  'shadow-sneak': m('Sombra Vil', 'ghost', 'physical', 40, 100, 30),
  'poltergeist': m('Poltergeist', 'ghost', 'physical', 110, 90, 5),
  'hex': m('Infortunio', 'ghost', 'special', 65, 100, 10),
  'shadow-punch': m('Puño Sombra', 'ghost', 'physical', 60, null, 20),
  'curse': m('Maldición', 'ghost', 'status', null, null, 10),
  'lick': m('Lengüetazo', 'ghost', 'physical', 30, 100, 30),

  // Psychic
  'psychic': m('Psíquico', 'psychic', 'special', 90, 100, 10),
  'psyshock': m('Psicocarga', 'psychic', 'special', 80, 100, 10),
  'calm-mind': m('Paz Mental', 'psychic', 'status', null, null, 20),
  'future-sight': m('Premonición', 'psychic', 'special', 120, 100, 10),
  'trick': m('Truco', 'psychic', 'status', null, 100, 10),
  'hypnosis': m('Hipnosis', 'psychic', 'status', null, 60, 20),
  'dream-eater': m('Comesueños', 'psychic', 'special', 100, 100, 15),
  'zen-headbutt': m('Cabezazo Zen', 'psychic', 'physical', 80, 90, 15),
  'teleport': m('Teletransporte', 'psychic', 'status', null, null, 20),
  'agility': m('Agilidad', 'psychic', 'status', null, null, 30),
  'confusion': m('Confusión', 'psychic', 'special', 50, 100, 25),

  // Ice
  'ice-beam': m('Rayo Hielo', 'ice', 'special', 90, 100, 10),
  'blizzard': m('Ventisca', 'ice', 'special', 110, 70, 5),
  'ice-punch': m('Puño Hielo', 'ice', 'physical', 75, 100, 15),
  'freeze-dry': m('Liofilización', 'ice', 'special', 70, 100, 20),
  'icicle-crash': m('Chuzos', 'ice', 'physical', 85, 90, 10),
  'aurora-veil': m('Velo Aurora', 'ice', 'status', null, null, 20),

  // Rock
  'stealth-rock': m('Trampa Rocas', 'rock', 'status', null, null, 20),
  'stone-edge': m('Roca Afilada', 'rock', 'physical', 100, 80, 5),
  'rock-slide': m('Avalancha', 'rock', 'physical', 75, 90, 10),
  'sandstorm': m('Tormenta Arena', 'rock', 'status', null, null, 10),
  'power-gem': m('Joya de Luz', 'rock', 'special', 80, 100, 20),

  // Flying
  'brave-bird': m('Pájaro Osado', 'flying', 'physical', 120, 100, 15),
  'roost': m('Respiro', 'flying', 'status', null, null, 5),
  'hurricane': m('Vendaval', 'flying', 'special', 110, 70, 10),
  'air-slash': m('Tajo Aéreo', 'flying', 'special', 75, 95, 15),
  'defog': m('Despejar', 'flying', 'status', null, null, 15),
  'tailwind': m('Viento Afín', 'flying', 'status', null, null, 15),
  'wing-attack': m('Ataque Ala', 'flying', 'physical', 60, 100, 35),
  'acrobatics': m('Acróbata', 'flying', 'physical', 55, 100, 15),

  // Bug
  'u-turn': m('Ida y Vuelta', 'bug', 'physical', 70, 100, 20),
  'bug-buzz': m('Zumbido', 'bug', 'special', 90, 100, 10),
  'quiver-dance': m('Danza Aleteo', 'bug', 'status', null, null, 20),
  'x-scissor': m('Tijera X', 'bug', 'physical', 80, 100, 15),
  'fury-cutter': m('Corte Furia', 'bug', 'physical', 40, 95, 20),
  'leech-life': m('Chupavidas', 'bug', 'physical', 80, 100, 10),
  'sticky-web': m('Red Viscosa', 'bug', 'status', null, null, 20),

  // Poison
  'sludge-bomb': m('Bomba Lodo', 'poison', 'special', 90, 100, 10),
  'sludge-wave': m('Onda Tóxica', 'poison', 'special', 95, 100, 10),
  'toxic': m('Tóxico', 'poison', 'status', null, 90, 10),
  'toxic-spikes': m('Púas Tóxicas', 'poison', 'status', null, null, 20),
  'gunk-shot': m('Lanzamugre', 'poison', 'physical', 120, 80, 5),
  'poison-jab': m('Puya Nociva', 'poison', 'physical', 80, 100, 20),
  'malignant-chain': m('Cadena Tóxica', 'poison', 'special', 100, 100, 10),

  // Normal
  'blood-moon': m('Luna Carmesí', 'normal', 'special', 140, 100, 5),
  'swords-dance': m('Danza Espada', 'normal', 'status', null, null, 20),
  'rapid-spin': m('Giro Rápido', 'normal', 'physical', 50, 100, 40),
  'extreme-speed': m('Velocidad Extrema', 'normal', 'physical', 80, 100, 5),
  'substitute': m('Sustituto', 'normal', 'status', null, null, 10),
  'protect': m('Protección', 'normal', 'status', null, null, 10),
  'recover': m('Recuperación', 'normal', 'status', null, null, 10),
  'soft-boiled': m('Amortiguador', 'normal', 'status', null, null, 10),
  'hyper-beam': m('Hiperrayo', 'normal', 'special', 150, 90, 5),
  'quick-attack': m('Ataque Rápido', 'normal', 'physical', 40, 100, 30),
  'slash': m('Cuchillada', 'normal', 'physical', 70, 100, 20),
  'pain-split': m('Divide Dolor', 'normal', 'status', null, null, 20),
  'belly-drum': m('Tambor', 'normal', 'status', null, null, 10),
  'facade': m('Imagen', 'normal', 'physical', 70, 100, 20),
} as const satisfies Record<string, Move>

export type MoveId = keyof typeof MOVES

/** Gen III and earlier derive Physical/Special from the move's type. */
export function categoryForGen(move: Move, gen: number): MoveCategory {
  if (move.category === 'status' || gen >= 4) return move.category
  return isPhysicalByTypeGen3(move.type) ? 'physical' : 'special'
}

export const CATEGORY_META: Record<MoveCategory, { label: string; icon: string }> = {
  physical: { label: 'Físico', icon: 'https://play.pokemonshowdown.com/sprites/categories/Physical.png' },
  special: { label: 'Especial', icon: 'https://play.pokemonshowdown.com/sprites/categories/Special.png' },
  status: { label: 'Estado', icon: 'https://play.pokemonshowdown.com/sprites/categories/Status.png' },
}

export type Platform = 'GBA' | 'NDS' | '3DS' | 'Switch'

export type Game = {
  id: string
  name: string
  code: string
  gen: number
  region: string
  accent: string
  note: string
  platform: Platform
  isHack?: boolean
}

export const GAMES: Game[] = [
  // GBA ROM HACKS (Most played)
  {
    id: 'radicalred',
    name: 'Pokémon Radical Red',
    code: 'RR',
    gen: 8,
    region: 'Kanto (ROM Hack)',
    accent: '#E5383B',
    note: 'Hack GBA Gen 8: Metagame competitivo de alto nivel, megas y tabla moderna.',
    platform: 'GBA',
    isHack: true,
  },
  {
    id: 'unbound',
    name: 'Pokémon Unbound',
    code: 'UNB',
    gen: 8,
    region: 'Borrius (ROM Hack)',
    accent: '#8E44AD',
    note: 'Hack GBA Gen 8: Mecánicas modernas, Hada, dificultad escalable y sets competitivos.',
    platform: 'GBA',
    isHack: true,
  },
  {
    id: 'emerald-rogue',
    name: 'Pokémon Emerald Rogue',
    code: 'ROG',
    gen: 8,
    region: 'Hoenn (Roguelike)',
    accent: '#10B981',
    note: 'Hack Roguelike: Rutas aleatorias, combates rápidos y tabla moderna Gen 8.',
    platform: 'GBA',
    isHack: true,
  },
  {
    id: 'inclement-emerald',
    name: 'Pokémon Inclement Emerald',
    code: 'INE',
    gen: 8,
    region: 'Hoenn (ROM Hack)',
    accent: '#06B6D4',
    note: 'Hack GBA Gen 8: Rebalance moderno de Hoenn con todas las generaciones.',
    platform: 'GBA',
    isHack: true,
  },
  {
    id: 'gaia',
    name: 'Pokémon Gaia',
    code: 'GAI',
    gen: 6,
    region: 'Orbtus (ROM Hack)',
    accent: '#D97706',
    note: 'Hack clásico de GBA: Tabla Gen 6 con tipo Hada y Megaevolución.',
    platform: 'GBA',
    isHack: true,
  },

  // GBA CLASSICS
  {
    id: 'firered',
    name: 'Pokémon Rojo Fuego',
    code: 'RF',
    gen: 3,
    region: 'Kanto',
    accent: '#EF4444',
    note: 'Gen III: Categoría Físico/Especial según el tipo elemental. Sin tipo Hada.',
    platform: 'GBA',
  },
  {
    id: 'emerald',
    name: 'Pokémon Esmeralda',
    code: 'EME',
    gen: 3,
    region: 'Hoenn',
    accent: '#2FBF71',
    note: 'Gen III: Frente de Batalla clásico. Categoría determinada por tipo.',
    platform: 'GBA',
  },

  // NDS DRAYANO HACKS & CLASSICS
  {
    id: 'renegade-platinum',
    name: 'Renegade Platinum',
    code: 'RNP',
    gen: 4,
    region: 'Sinnoh (Drayano Hack)',
    accent: '#94A3B8',
    note: 'Hack NDS de alta dificultad: Rebalance completo de tipos y líderes competitivos.',
    platform: 'NDS',
    isHack: true,
  },
  {
    id: 'blazeblack2-redux',
    name: 'Blaze Black 2 Redux',
    code: 'BB2',
    gen: 5,
    region: 'Teselia (Drayano Hack)',
    accent: '#F59E0B',
    note: 'Hack NDS Gen 5: Tipo Hada opcional, IA competitiva y tabla completa.',
    platform: 'NDS',
    isHack: true,
  },
  {
    id: 'platinum',
    name: 'Pokémon Platino',
    code: 'PLT',
    gen: 4,
    region: 'Sinnoh',
    accent: '#B4BED6',
    note: 'Gen IV: Llegada de la división Físico/Especial por movimiento. Sin tipo Hada.',
    platform: 'NDS',
  },
  {
    id: 'heartgold',
    name: 'Pokémon Oro HeartGold',
    code: 'HG',
    gen: 4,
    region: 'Johto · Kanto',
    accent: '#E8B53A',
    note: 'Gen IV: Acero resiste Fantasma y Siniestro. Sin tipo Hada.',
    platform: 'NDS',
  },
  {
    id: 'black2',
    name: 'Pokémon Blanco 2',
    code: 'B2',
    gen: 5,
    region: 'Teselia',
    accent: '#3E97E0',
    note: 'Gen V: Acero resiste Fantasma y Siniestro. Movimientos y habilidades ocultas.',
    platform: 'NDS',
  },

  // 3DS
  {
    id: 'pokemon-y',
    name: 'Pokémon Y',
    code: 'Y',
    gen: 6,
    region: 'Kalos',
    accent: '#2F80ED',
    note: 'Gen VI: Llega el tipo Hada. Acero pierde resistencias a Siniestro/Fantasma.',
    platform: '3DS',
  },
  {
    id: 'oras',
    name: 'Pokémon Rubí Omega',
    code: 'OR',
    gen: 6,
    region: 'Hoenn (3DS)',
    accent: '#DC2626',
    note: 'Gen VI: Megaevoluciones y Regresión Primigenia.',
    platform: '3DS',
  },
  {
    id: 'ultramoon',
    name: 'Pokémon Ultra Luna',
    code: 'UL',
    gen: 7,
    region: 'Alola',
    accent: '#7B61FF',
    note: 'Gen VII: Movimientos Z, Formas Alola y Ultraumbrales.',
    platform: '3DS',
  },

  // SWITCH & HACKS
  {
    id: 'luminescent',
    name: 'Platino Brillante',
    code: 'LPB',
    gen: 8,
    region: 'Sinnoh (Hack BDSP)',
    accent: '#A2C4C9',
    note: 'Hack BDSP: IA competitiva, tabla Gen 8 y tipo Hada.',
    platform: 'Switch',
    isHack: true,
  },
  {
    id: 'scarlet-violet',
    name: 'Pokémon Escarlata',
    code: 'SCA',
    gen: 9,
    region: 'Paldea',
    accent: '#EA580C',
    note: 'Gen IX: Teracristalización, formas Paradoja y tabla moderna.',
    platform: 'Switch',
  },
]

export type Item = {
  id: string
  name: string
  desc: string
}

export const ITEMS = {
  leftovers: { id: 'leftovers', name: 'Restos', desc: 'Recupera 1/16 de PS cada turno: longevidad gratis.' },
  lifeOrb: { id: 'life-orb', name: 'Vidasfera', desc: '+30% de daño a cambio de 10% de PS por ataque.' },
  choiceScarf: { id: 'choice-scarf', name: 'Pañuelo Elección', desc: '+50% Velocidad, pero bloquea en un movimiento.' },
  choiceBand: { id: 'choice-band', name: 'Cinta Elección', desc: '+50% Ataque, bloqueado en un único movimiento.' },
  choiceSpecs: { id: 'choice-specs', name: 'Gafas Elección', desc: '+50% At. Esp., bloqueado en un único movimiento.' },
  eviolite: { id: 'eviolite', name: 'Mineral Evolutivo', desc: '+50% Def y Def. Esp a Pokémon que aún pueden evolucionar.' },
  assaultVest: { id: 'assault-vest', name: 'Chaleco Asalto', desc: '+50% Def. Esp, pero solo permite movimientos de ataque.' },
  focusSash: { id: 'focus-sash', name: 'Banda Focus', desc: 'Sobrevive a 1 PS un golpe que debilitaría a PS máx.' },
  rockyHelmet: { id: 'rocky-helmet', name: 'Casco Dentado', desc: 'Daña 1/6 de PS a quien golpee con contacto.' },
  weaknessPolicy: { id: 'weakness-policy', name: 'Seguro Debilidad', desc: '+2 Atq y At. Esp al recibir golpe supereficaz.' },
  heavyDutyBoots: { id: 'heavy-duty-boots', name: 'Botas Gruesas', desc: 'Inmune a hazards (Trampa Rocas, Púas, Red Viscosa).' },
  expertBelt: { id: 'expert-belt', name: 'Cinta Experto', desc: '+20% de daño en ataques supereficaces sin penalización.' },
  lumBerry: { id: 'lum-berry', name: 'Baya Ziuela', desc: 'Cura cualquier estado una vez: setup seguro sin miedo.' },
  sitrusBerry: { id: 'sitrus-berry', name: 'Baya Zidra', desc: 'Restaura 25% de PS al caer por debajo del 50% de vida.' },
  smoothRock: { id: 'smooth-rock', name: 'Roca Suave', desc: 'La tormenta de arena dura 8 turnos en vez de 5.' },
  dampRock: { id: 'damp-rock', name: 'Roca Lluvia', desc: 'La lluvia dura 8 turnos en lugar de 5.' },
  heatRock: { id: 'heat-rock', name: 'Roca Calor', desc: 'El clima soleado dura 8 turnos en lugar de 5.' },
  toxicOrb: { id: 'toxic-orb', name: 'Toxisfera', desc: 'Envenena para activar Antídoto, Agallas o Magia Guard.' },
  flameOrb: { id: 'flame-orb', name: 'Llamasfera', desc: 'Quema para activar Agallas sin reducir el ataque físico.' },
  blackSludge: { id: 'black-sludge', name: 'Lodo Negro', desc: 'Cura a tipo Veneno; castiga si es robado por otros.' },
  lightClay: { id: 'light-clay', name: 'Refleluz', desc: 'Pantalla de Luz y Reflejo duran 8 turnos en vez de 5.' },
  airBalloon: { id: 'air-balloon', name: 'Globo Helio', desc: 'Inmunidad total a tipo Tierra hasta recibir un golpe.' },
  boosterEnergy: { id: 'booster-energy', name: 'Energía Potenciadora', desc: 'Activa Paleosíntesis o Carga Cuark aumentando el stat más alto.' },
} as const satisfies Record<string, Item>

export type ItemKey = keyof typeof ITEMS

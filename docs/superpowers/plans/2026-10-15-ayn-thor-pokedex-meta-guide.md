# Guía Universal Meta Pokédex para AYN Thor - Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Pokédex into a fully functional, offline-first meta guide and team recommender for AYN Thor's second screen across multiple Pokémon generations and hackroms, without touching any UX or visual design.

**Architecture:** A static, index-based data architecture with game-specific rule adapters (Gen 3 to 8), localStorage state management for party & PC box per game cartridge, and a zero-latency client-side recommendation engine evaluating defensive and offensive team synergies against the player's PC storage.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, LocalStorage API.

**Spec:** `docs/superpowers/specs/2026-10-15-ayn-thor-pokedex-meta-guide-design.md`

## Global Constraints

- Preserve 100% of the existing UX, layout, fonts, chamfer styling, AMOLED palette, and 31:27 aspect ratio (620x540 / 1240x1080).
- Pure client-side offline execution: zero runtime API calls, zero battery/CPU overhead while running games on the console.
- Universal support for target games: Platino Brillante (BDSP hack), Unbound (GBA hack), Blanco 2 (DS), Y (3DS), Ultra Luna (3DS) + Esmeralda, Platino, HeartGold, Radical Red.
- Dynamic team recommendation prioritizing Pokémon marked as "En PC" (Caja).
- Strictly ASCII-compliant code files without broken character encodings.

## Review Focus

1. Switching cartridges preserves or switches party/PC state without leaking members between different games.
2. Pre-Gen 6 games (Gen 3, 4, 5) correctly disable Fairy typing in calculation and mark Fairy moves as unavailable.
3. Generation 3 physical/special categories are determined purely by move type, whereas Gen 4+ uses move-specific category.
4. Marking a Pokémon as "En PC" immediately updates the Sinergia recommendations without requiring a page reload.
5. If the PC is empty, the Sinergia recommendations fall back cleanly to top wild meta recommendations without throwing errors.

---

### Task 1: Scaffolding, Package Dependencies & Verification Setup

**Files:**
- Modify: `package.json`
- Test: Terminal command `npm install` and `npm run build`

**Interfaces:**
- Consumes: `package.json` scripts and dependencies
- Produces: Installed `node_modules` and working build environment

- [ ] **Step 1: Check node and npm availability and install dependencies**

Run: `npm install`
Expected: Successfully installs all packages into `node_modules` without peer dependency conflicts.

- [ ] **Step 2: Verify baseline build**

Run: `npm run build`
Expected: Next.js builds `.next` directory without TypeScript or Tailwind errors.

---

### Task 2: Expanded Game Adapters & Generation Mechanics

**Files:**
- Modify: `lib/dex/games.ts`
- Modify: `lib/dex/types.ts`
- Test: `lib/dex/__tests__/games.test.ts` (or direct verification via node test runner)

**Interfaces:**
- Consumes: `PokeType`, `Game`
- Produces: `GAMES` with 9 supported games (including Platino Brillante, Unbound, Blanco 2, Y, Ultra Luna) and `typeMultiplier(atk, def, gen)`.

- [ ] **Step 1: Define game definitions in `lib/dex/games.ts`**

Update `GAMES` array to include all requested games:
```typescript
export const GAMES: Game[] = [
  {
    id: 'luminescent',
    name: 'Platino Brillante',
    code: 'LPB',
    gen: 8,
    region: 'Sinnoh (Luminescent)',
    accent: '#B4BED6',
    note: 'Hack de BDSP: Dificultad competitiva, tabla Gen 8 y tipo Hada.',
  },
  {
    id: 'unbound',
    name: 'Pokémon Unbound',
    code: 'UNB',
    gen: 8,
    region: 'Borrius (ROM hack)',
    accent: '#9B51E0',
    note: 'Hack GBA Gen 8: Mecánicas modernas, Hada, división de ataques.',
  },
  {
    id: 'black2',
    name: 'Pokémon Blanco 2',
    code: 'B2',
    gen: 5,
    region: 'Teselia',
    accent: '#3E97E0',
    note: 'Gen V: Acero resiste Fantasma/Siniestro. Sin tipo Hada.',
  },
  {
    id: 'pokemon-y',
    name: 'Pokémon Y',
    code: 'Y',
    gen: 6,
    region: 'Kalos',
    accent: '#2F80ED',
    note: 'Gen VI: Llega el tipo Hada. Acero pierde resistencias.',
  },
  {
    id: 'ultramoon',
    name: 'Pokémon Ultra Luna',
    code: 'UM',
    gen: 7,
    region: 'Alola',
    accent: '#7B61FF',
    note: 'Gen VII: Movimientos Z, Formas Alola y tabla moderna.',
  },
  {
    id: 'emerald',
    name: 'Pokémon Esmeralda',
    code: 'EME',
    gen: 3,
    region: 'Hoenn',
    accent: '#2FBF71',
    note: 'Gen III: Categoría Físico/Especial según tipo. Sin Hada.',
  },
  {
    id: 'platinum',
    name: 'Pokémon Platino',
    code: 'PLT',
    gen: 4,
    region: 'Sinnoh',
    accent: '#A5A5C7',
    note: 'Gen IV: División Físico/Especial. Sin tipo Hada.',
  },
  {
    id: 'heartgold',
    name: 'Pokémon Oro HeartGold',
    code: 'HG',
    gen: 4,
    region: 'Johto / Kanto',
    accent: '#E8B53A',
    note: 'Gen IV: Acero resiste Fantasma y Siniestro.',
  },
  {
    id: 'radicalred',
    name: 'Pokémon Radical Red',
    code: 'RR',
    gen: 8,
    region: 'Kanto (ROM hack)',
    accent: '#E5383B',
    note: 'Hack con metagame competitivo Gen 8.',
  },
]
```

- [ ] **Step 2: Verify `typeMultiplier` mechanics in `lib/dex/types.ts`**

Ensure `typeMultiplier` cleanly implements:
1. `gen < 6`: Fairy attacking or defending always evaluates as neutral 1x (or type filtered out).
2. `gen < 6`: Steel defending against Ghost or Dark receives 0.5x multiplier.
3. `gen >= 6`: Steel defending against Ghost or Dark receives 1.0x neutral damage.

- [ ] **Step 3: Verification**

Run: `node -e "const { typeMultiplier } = require('./lib/dex/types'); console.log('Gen 5 dark vs steel:', typeMultiplier('dark', 'steel', 5)); console.log('Gen 6 dark vs steel:', typeMultiplier('dark', 'steel', 6));"` (or with tsx).
Expected: Gen 5 returns 0.5, Gen 6 returns 1.

---

### Task 3: Competitive Items Catalog & Expanded Movepool

**Files:**
- Create: `lib/dex/items.ts`
- Modify: `lib/dex/moves.ts`

**Interfaces:**
- Consumes: `PokeType`, `MoveCategory`
- Produces: `ITEMS` map, `MOVES` dictionary with 100+ key meta moves.

- [ ] **Step 1: Create `lib/dex/items.ts`**

Define standard competitive items with Spanish names and concise tactical descriptions:
- Restos (Leftovers)
- Vidasfera (Life Orb)
- Pañuelo Elección (Choice Scarf)
- Cinta Elección (Choice Band)
- Gafas Elección (Choice Specs)
- Casco Dentado (Rocky Helmet)
- Banda Focus (Focus Sash)
- Mineral Evolutivo (Eviolite - +50% Def y DfE a Pokémon no evolucionados)
- Chaleco Asalto (Assault Vest - +50% DfE pero solo permite movimientos de ataque)
- Seguro Debilidad (Weakness Policy)
- Botas Gruesas (Heavy-Duty Boots)
- Baya Ziuela (Lum Berry)
- Baya Zidra (Sitrus Berry)

- [ ] **Step 2: Expand `lib/dex/moves.ts` with competitive moves**

Add key moves across all types:
- Water: Scald, Hydro Pump, Surf, Aqua Jet, Waterfall
- Fire: Flamethrower, Fire Blast, Flare Blitz, Fire Punch, Mystical Fire
- Grass: Giga Drain, Energy Ball, Leaf Storm, Wood Hammer, Spore, Leech Seed
- Electric: Thunderbolt, Volt Switch, Thunder Wave, Wild Charge
- Ground: Earthquake, Earth Power, Scorching Sands, Dig
- Rock: Stealth Rock, Stone Edge, Rock Slide
- Flying: Brave Bird, Hurricane, Roost, Air Slash, Acrobatics
- Dragon: Draco Meteor, Dragon Claw, Outrage, Dragon Dance
- Steel: Iron Head, Flash Cannon, Bullet Punch, Heavy Slam
- Fairy: Moonblast, Play Rough, Dazzling Gleam
- Fighting: Close Combat, Aura Sphere, Focus Blast, Drain Punch, Mach Punch
- Psychic: Psychic, Psyshock, Calm Mind, Trick
- Ghost: Shadow Ball, Shadow Claw, Poltergeist, Hex, Will-O-Wisp
- Dark: Knock Off, Dark Pulse, Crunch, Sucker Punch, Taunt, Nasty Plot
- Ice: Ice Beam, Blizzard, Ice Punch, Freeze-Dry, Triple Axel
- Bug: U-turn, Bug Buzz, Quiver Dance
- Poison: Sludge Bomb, Sludge Wave, Toxic, Toxic Spikes
- Normal: Extreme Speed, Swords Dance, Substitute, Recover, Soft-Boiled

---

### Task 4: Multi-Generational Meta Pokémon Roster & Builds

**Files:**
- Modify: `lib/dex/pokemon.ts`

**Interfaces:**
- Consumes: `ITEMS`, `MOVES`, `PokeType`, `Stats`, `Build`
- Produces: Extended `POKEDEX` array with 30+ staple meta Pokémon across Gen 1–8.

- [ ] **Step 1: Expand `POKEDEX` with essential meta picks**

Include foundational meta Pokémon representing all roles (Physical Sweeper, Special Sweeper, Wall, Hazard Setter, Pivot, Cleaner) for the target games:
- Starters & Aces: Garchomp, Scizor, Lucario, Tyranitar, Gardevoir, Gengar, Dragonite, Rotom-Wash
- Gen 3-4 Staples: Swampert, Salamence, Metagross, Infernape, Togekiss, Gliscor
- Gen 5 Staples: Excadrill, Ferrothorn, Volcarona, Conkeldurr, Chandelure, Serperior
- Gen 6 Staples: Greninja, Aegislash, Talonflame, Sylveon, Goodra, Clefable
- Gen 7-8 Staples: Mimikyu, Toxapex, Corviknight, Dragapult, Cinderace
- Eviolite Specials: Chansey, Porygon2
Each Pokémon must have:
- Exact base stats, abilities, and evolutionary chain.
- 2 distinct meta builds (e.g. Offensive setup vs Defensive/Scarf) with complete EV spreads, nature, item, moves, and a strategy TIP.
- Spanish descriptions and correct learnset highlights.

- [ ] **Step 2: Verify `DEX_BY_KEY` lookup**

Ensure every Pokémon key is unique and indexed in `DEX_BY_KEY`.

---

### Task 5: PC Box Storage & Game-Isolated LocalStorage Persistence

**Files:**
- Create: `lib/dex/storage.ts`

**Interfaces:**
- Consumes: `gameId: string`, `team: (string | null)[]`, `pcKeys: string[]`
- Produces: `loadGameState(gameId)`, `saveGameState(gameId, state)`

- [ ] **Step 1: Implement `lib/dex/storage.ts`**

```typescript
export type GameStorageState = {
  team: (string | null)[]
  pc: string[]
}

const STORAGE_PREFIX = 'silph_dex_state_'

export function loadGameState(gameId: string, defaultTeam: (string | null)[]): GameStorageState {
  if (typeof window === 'undefined') return { team: defaultTeam, pc: [] }
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`)
    if (!raw) return { team: defaultTeam, pc: [] }
    const parsed = JSON.parse(raw) as Partial<GameStorageState>
    return {
      team: Array.isArray(parsed.team) && parsed.team.length === 6 ? parsed.team : defaultTeam,
      pc: Array.isArray(parsed.pc) ? parsed.pc : [],
    }
  } catch {
    return { team: defaultTeam, pc: [] }
  }
}

export function saveGameState(gameId: string, state: GameStorageState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${gameId}`, JSON.stringify(state))
  } catch {}
}
```

- [ ] **Step 2: Test storage handling**

Verify reading/writing to localStorage with mock data handles corrupted JSON gracefully.

---

### Task 6: PC-Aware Team Synergy & Recommendation Engine

**Files:**
- Modify: `lib/dex/analysis.ts`

**Interfaces:**
- Consumes: `team: Pokemon[]`, `gen: number`, `pcKeys?: string[]`
- Produces: Enhanced `teamSynergy()` returning both `threats`, `gaps`, and prioritized `pcRecommendations`.

- [ ] **Step 1: Enhance `teamSynergy` algorithm in `lib/dex/analysis.ts`**

Calculate:
1. `threats`: Types that hit 3+ members supereffectively (or 2+ with 0 resists).
2. `gaps`: Types against which the team has no supereffective attacking moves.
3. `pcRecommendations`:
   - Inspect all Pokémon present in `pcKeys`.
   - Score each PC candidate:
     * $+3$ points for each team threat type that this Pokémon resists or is immune to.
     * $+2$ points for each gap type that this Pokémon can hit supereffectively with STAB or primary moves.
     * $+1$ point if it balances the team's Physical vs Special offensive/defensive ratio.
   - Sort by score descending and return top 3 PC candidates with explanation text (e.g. `Resiste Tierra y cubre Dragón`).
4. `wildRecommendations`:
   - If PC has no candidates (or score is 0), evaluate top meta Pokémon from the Dex matching the needed defensive/offensive coverage.

- [ ] **Step 2: Verification**

Test synergy function with a team weak to Ground (Tyranitar + Lucario): ensure a PC containing Rotom-Wash or Corviknight recommends them with highest priority.

---

### Task 7: UI Wireup & PC Toggle Without UX/Design Alteration

**Files:**
- Modify: `components/dex/pokedex-app.tsx`
- Modify: `components/dex/views/scan-view.tsx`
- Modify: `components/dex/views/party-view.tsx`
- Modify: `components/dex/search-drawer.tsx`

**Interfaces:**
- Consumes: `storage.ts`, `analysis.ts`, `pokedex.ts`
- Produces: Seamless interactive experience with PC toggle, party dock persistence, and dynamic synergy recommendations.

- [ ] **Step 1: Update `pokedex-app.tsx` state management**

- Integrate `loadGameState` and `saveGameState` triggered by changes to `gameId`, `team`, and `pcKeys`.
- Provide `isPokemonInPc(key)` and `togglePc(key)` handlers.

- [ ] **Step 2: Add PC Toggle in `ScanView`**

Without changing the layout or breaking aspect ratio:
- In the top info bar or panel header of `ScanView`, add a subtle chamfered button:
  `[+ PC]` (when not in PC) / `[EN PC]` (highlighted with accent color when in PC).
- Tapping it adds or removes the Pokémon from the user's PC box with instant tactile response.

- [ ] **Step 3: Add PC Indicator in `SearchDrawer`**

- In `SearchDrawer`, display a small marker on Pokémon that are already stored in PC.
- Provide a quick toggle button or status indicator so users can quickly populate their PC box.

- [ ] **Step 4: Update `PartyView` recommendation cards**

- In `PartyView`'s "Recomendación" panel:
  - If `pcRecommendations` has items:
    Show `DE TU PC:` with the Pokémon's sprite icon, name, and exact coverage reasons (`Resiste Fuego · Cubre Agua`).
    Tapping it allows instant selection or adding to an empty party slot.
  - If PC has no suitable matches:
    Show `SUGERENCIA:` with the recommended meta partner and coverage details.

---

### Task 8: Production Build, Testing & Live Preview Verification

**Files:**
- Test: Full build, runtime verification via browser subagent

- [ ] **Step 1: Compile with TypeScript**

Run: `npm run build`
Expected: 0 errors, output clean Next.js build.

- [ ] **Step 2: Run dev server**

Run: `npm run dev`
Expected: Dev server boots on `http://localhost:3000`.

- [ ] **Step 3: Browser inspection & interaction test**

Use browser subagent to:
1. Verify the 31:27 aspect ratio fits the viewport cleanly.
2. Select *Pokémon Platino Brillante* and verify Gen 8 mechanics & BDSP notes.
3. Select *Pokémon Unbound* and verify GBA hackrom metadata.
4. Mark 2 Pokémon in PC, add 3 Pokémon to Team with shared weakness, navigate to `EQUIPO` (PartyView), and verify PC-based recommendation is displayed.
5. Check `BUILD` view to ensure items, moves, EVs, and tips render crisply.

---

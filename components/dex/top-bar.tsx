import type { Game } from '@/lib/dex/games'
import type { Pokemon } from '@/lib/dex/pokemon'
import type { Mode } from './left-dock'

const MODE_LABEL: Record<Mode, string> = {
  scan: 'SCANNER',
  rival: 'VS RIVAL',
  build: 'BUILD ÓPTIMA',
  party: 'SINERGIA',
  util: 'UTILIDAD',
}

export function TopBar({
  game,
  pokemon,
  mode,
  onOpenCartridge,
}: {
  game: Game
  pokemon: Pokemon
  mode: Mode
  onOpenCartridge: () => void
}) {
  return (
    <header className="relative flex h-7 shrink-0 items-center gap-2 border-b-2 border-black bg-shell-2 pl-2 pr-1">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-(--acc) opacity-60" />

      <div className="flex items-center gap-1.5" aria-label={`LED de tipo principal de ${pokemon.name}`}>
        <span className="relative grid size-4 place-items-center rounded-full bg-black ring-1 ring-white/20">
          <span
            className="animate-led size-2.5 rounded-full bg-(--led)"
            style={{ boxShadow: 'inset 0 -1px 0 rgb(0 0 0 / 0.4), 0 0 0 2px color-mix(in srgb, var(--led) 30%, transparent)' }}
          />
          <span aria-hidden className="absolute left-1 top-1 size-1 rounded-full bg-white/70" />
        </span>
        <span aria-hidden className="size-1.5 rounded-full bg-[#F0483E]" />
        <span aria-hidden className="size-1.5 rounded-full bg-[#F5C93B]" />
        <span aria-hidden className="size-1.5 rounded-full bg-[#3DDC6B]" />
      </div>

      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className="font-mono text-2xs font-extrabold tracking-[0.18em] text-white">PokeThor Assistant</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="font-mono text-3xs tracking-[0.2em] text-(--acc)">{MODE_LABEL[mode]}</span>
        <button
          type="button"
          onClick={onOpenCartridge}
          aria-label={`Cartucho insertado: ${game.name}. Cambiar juego`}
          className="flex h-6 items-center gap-1.5 rounded-sm border-t border-b-2 border-t-white/10 border-b-black bg-black px-1 transition-transform duration-150 ease-snap active:translate-y-px"
        >
          <span className="chamfer-tr relative flex h-4.5 w-28 items-center gap-1 bg-[#2a2c35] pl-1 pr-2">
            <span className="h-3 w-5 shrink-0 rounded-[2px] bg-(--acc) font-mono text-[0.4375rem] font-extrabold leading-3 text-black">
              {game.code}
            </span>
            <span className="truncate text-3xs font-bold uppercase tracking-wide text-white/85">
              {game.name.replace('Pokémon ', '')}
            </span>
          </span>
          <span className="font-mono text-3xs font-bold text-white/50">G{game.gen}</span>
        </button>
      </div>
    </header>
  )
}

import { boxIconUrl, DEX_BY_KEY } from '@/lib/dex/pokemon'
import { cn } from '@/lib/utils'

export function PartyDock({
  team,
  currentKey,
  onSelect,
  onEmpty,
}: {
  team: (string | null)[]
  currentKey: string
  onSelect: (key: string) => void
  onEmpty: () => void
}) {
  const count = team.filter(Boolean).length
  return (
    <nav
      aria-label="Equipo"
      className="flex h-14 shrink-0 items-center gap-1.5 border-t-2 border-black bg-shell-2 px-1.5 pb-1 pt-1"
    >
      <div className="flex w-[3.25rem] shrink-0 flex-col items-center leading-none">
        <span className="font-mono text-3xs tracking-[0.2em] text-white/40">PARTY</span>
        <span className="font-mono text-base font-extrabold text-(--acc)">
          {count}
          <span className="text-white/30">/6</span>
        </span>
      </div>
      {team.map((key, i) => {
        const p = key ? DEX_BY_KEY[key] : null
        const active = key === currentKey
        return (
          <button
            key={i}
            type="button"
            onClick={() => (p ? onSelect(p.key) : onEmpty())}
            aria-label={p ? `Slot ${i + 1}: ${p.name}` : `Slot ${i + 1} vacío, buscar Pokémon`}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'press relative flex h-11 flex-1 items-center gap-1 overflow-hidden rounded-full border-t pl-0.5 pr-2',
              active ? 'border-t-white/40 bg-(--acc)' : 'border-t-white/10 bg-[#1d1f26]',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border-2',
                active ? 'border-black' : 'border-black/80',
              )}
              style={{
                background: p
                  ? 'linear-gradient(#d8383a 0 47%, #111 47% 53%, #ececf0 53% 100%)'
                  : 'linear-gradient(#2c2e36 0 47%, #111 47% 53%, #23252c 53% 100%)',
              }}
            >
              <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#111] bg-white" />
              {p ? (
                <img
                  src={boxIconUrl(p.iconId)}
                  alt=""
                  draggable={false}
                  className="pixelated relative -mt-1 h-[1.875rem] w-10 object-contain"
                />
              ) : null}
            </span>
            <span
              className={cn(
                'min-w-0 truncate text-left text-2xs font-bold uppercase leading-tight',
                active ? 'text-black' : p ? 'text-white/80' : 'text-white/25',
              )}
            >
              {p ? p.name.replace('-Wash', '-W') : 'Vacío'}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

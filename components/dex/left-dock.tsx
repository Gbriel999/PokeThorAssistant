import { Crosshair, GitBranch, Radar, Swords, UsersRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Mode = 'scan' | 'rival' | 'build' | 'party' | 'util'

const MODES: { id: Mode; label: string; sub: string; Icon: typeof Radar }[] = [
  { id: 'scan', label: 'SCAN', sub: 'Combate', Icon: Radar },
  { id: 'rival', label: 'VS RIVAL', sub: 'Counter', Icon: Crosshair },
  { id: 'build', label: 'BUILD', sub: 'IVs · EVs', Icon: Swords },
  { id: 'party', label: 'EQUIPO', sub: 'Sinergia', Icon: UsersRound },
  { id: 'util', label: 'UTIL', sub: 'Evo · Mov', Icon: GitBranch },
]

export function LeftDock({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <nav aria-label="Modos" className="flex w-16 shrink-0 flex-col gap-1 border-r-2 border-black bg-shell-2 p-1 pb-1.5">
      {MODES.map(({ id, label, sub, Icon }) => {
        const active = id === mode
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={cn(
              'press chamfer-sm relative flex flex-1 flex-col items-center justify-center gap-0.5 border-t',
              active ? 'border-t-white/40 bg-(--acc) text-black' : 'border-t-white/10 bg-[#22242c] text-white/75',
            )}
          >
            <span
              aria-hidden
              className={cn('absolute left-0 top-2 bottom-2 w-0.5', active ? 'bg-black/40' : 'bg-transparent')}
            />
            <Icon className="size-5" strokeWidth={2.25} aria-hidden />
            <span className="font-mono text-2xs font-extrabold tracking-wider">{label}</span>
            <span className={cn('text-3xs font-semibold', active ? 'text-black/60' : 'text-white/35')}>{sub}</span>
          </button>
        )
      })}
    </nav>
  )
}

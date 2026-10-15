import { ChevronDown, ChevronUp, Minus, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RightDock({
  inTeam,
  teamFull,
  onSearch,
  onPrev,
  onNext,
  onToggleTeam,
}: {
  inTeam: boolean
  teamFull: boolean
  onSearch: () => void
  onPrev: () => void
  onNext: () => void
  onToggleTeam: () => void
}) {
  const disabled = !inTeam && teamFull
  const base =
    'press chamfer-sm flex flex-col items-center justify-center gap-0.5 border-t border-t-white/10 bg-[#22242c] text-white/80'
  return (
    <nav aria-label="Controles" className="flex w-16 shrink-0 flex-col gap-1.5 border-l-2 border-black bg-shell-2 p-1.5 pb-2">
      <button type="button" onClick={onSearch} className={cn(base, 'flex-[1.4] border-t-white/40 bg-(--acc) text-black')}>
        <Search className="size-5" strokeWidth={2.5} aria-hidden />
        <span className="font-mono text-2xs font-extrabold tracking-wider">BUSCAR</span>
      </button>
      <button type="button" onClick={onPrev} aria-label="Anterior" className={cn(base, 'flex-1')}>
        <ChevronUp className="size-6" strokeWidth={2.5} aria-hidden />
        <span className="font-mono text-3xs tracking-wider text-white/40">ANT</span>
      </button>
      <button type="button" onClick={onNext} aria-label="Siguiente" className={cn(base, 'flex-1')}>
        <ChevronDown className="size-6" strokeWidth={2.5} aria-hidden />
        <span className="font-mono text-3xs tracking-wider text-white/40">SIG</span>
      </button>
      <button
        type="button"
        onClick={onToggleTeam}
        disabled={disabled}
        aria-label={inTeam ? 'Quitar del equipo' : 'Añadir al equipo'}
        className={cn(
          base,
          'flex-[1.2] disabled:opacity-35 disabled:active:translate-y-0',
          inTeam ? 'bg-[#3a1418] text-[#ff8a80]' : 'bg-[#123321] text-[#7dffa8]',
        )}
      >
        {inTeam ? <Minus className="size-5" strokeWidth={3} aria-hidden /> : <Plus className="size-5" strokeWidth={3} aria-hidden />}
        <span className="font-mono text-2xs font-extrabold tracking-wider">{inTeam ? 'QUITAR' : disabled ? 'LLENO' : 'EQUIPO'}</span>
      </button>
    </nav>
  )
}

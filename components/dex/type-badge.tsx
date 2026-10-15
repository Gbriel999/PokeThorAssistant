import { cn } from '@/lib/utils'
import { TYPE_META, typeIconUrl, type PokeType } from '@/lib/dex/types'

const DARK_TEXT = new Set<PokeType>(['electric', 'ice', 'steel', 'ground', 'normal', 'bug', 'rock', 'grass', 'fairy'])

export function TypeIcon({
  type,
  className,
  label = true,
}: {
  type: PokeType
  className?: string
  label?: boolean
}) {
  const meta = TYPE_META[type]
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label ? meta.name : undefined}
      aria-hidden={label ? undefined : true}
      title={label ? meta.name : undefined}
      className={cn('inline-grid size-5 shrink-0 place-items-center rounded-full', className)}
      style={{
        backgroundColor: meta.color,
        boxShadow: 'inset 0 -2px 0 rgb(0 0 0 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.4)',
      }}
    >
      <img src={typeIconUrl(type)} alt="" draggable={false} className="size-[60%]" />
    </span>
  )
}

export function TypeBadge({ type, size = 'md' }: { type: PokeType; size?: 'sm' | 'md' }) {
  const meta = TYPE_META[type]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full border-b-2 border-black/40 font-bold uppercase tracking-wide',
        size === 'md' ? 'h-5 pl-0.5 pr-2 text-2xs' : 'h-4 pl-0.5 pr-1.5 text-3xs',
      )}
      style={{ backgroundColor: meta.color, color: DARK_TEXT.has(type) ? '#111216' : '#fff' }}
    >
      <span
        aria-hidden
        className={cn('grid place-items-center rounded-full', size === 'md' ? 'size-4' : 'size-3')}
        style={{ backgroundColor: 'rgb(0 0 0 / 0.28)' }}
      >
        <img src={typeIconUrl(type)} alt="" draggable={false} className="size-[70%]" />
      </span>
      {meta.name}
    </span>
  )
}

export function TypeChip({ type, mark }: { type: PokeType; mark?: string }) {
  const meta = TYPE_META[type]
  return (
    <span className="chamfer-sm inline-flex h-5 items-center gap-1 bg-black/55 pl-0.5 pr-1.5">
      <TypeIcon type={type} label={false} className="size-4" />
      <span className="text-2xs font-bold uppercase tracking-wide text-white/90">{meta.short}</span>
      {mark ? <span className="font-mono text-3xs font-bold text-white/60">{mark}</span> : null}
      <span className="sr-only">{meta.name}</span>
    </span>
  )
}

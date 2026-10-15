import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Panel({
  title,
  aside,
  className,
  bodyClassName,
  children,
}: {
  title?: string
  aside?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        'chamfer dot-matrix relative flex min-h-0 flex-col border-t border-b-2 border-t-white/15 border-b-black/80 bg-shell',
        className,
      )}
    >
      {title ? (
        <header className="flex h-5 shrink-0 items-center justify-between gap-2 border-b border-white/5 bg-white/[0.035] px-2.5">
          <h2 className="flex items-center gap-1.5 font-mono text-3xs font-bold uppercase tracking-[0.2em] text-white/55">
            <span aria-hidden className="size-1 bg-(--acc)" />
            {title}
          </h2>
          {aside}
        </header>
      ) : null}
      <div className={cn('flex min-h-0 flex-1 flex-col', bodyClassName)}>{children}</div>
    </section>
  )
}

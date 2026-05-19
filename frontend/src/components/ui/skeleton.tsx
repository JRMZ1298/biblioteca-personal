interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-strong ${className}`}
      aria-hidden="true"
    />
  )
}

function SkeletonCardCompact() {
  return (
    <div className="flex gap-3 md:hidden">
      <Skeleton className="h-20 w-14 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-14 shrink-0" />
        </div>
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

interface BookCardSkeletonProps {
  index?: number
}

export function BookCardSkeleton({ index = 0 }: BookCardSkeletonProps) {
  const isEven = index % 2 === 0

  return (
    <>
      <SkeletonCardCompact />
      <div className={`hidden md:flex flex-col gap-md ${isEven ? '' : 'md:mt-12'}`}>
        <Skeleton className="w-full aspect-[2/3] rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
    </>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-4 shadow-card space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-12" />
    </div>
  )
}

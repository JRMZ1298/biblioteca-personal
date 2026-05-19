interface ProgressBarProps {
  current: number | null
  total: number | null
  onChange: (page: number) => void
}

export default function ProgressBar({ current, total, onChange }: ProgressBarProps) {
  const progress = current && total ? Math.min((current / total) * 100, 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-caption text-muted">Progreso</span>
        <span className="text-caption text-muted-soft">
          {current ?? 0} / {total ?? '—'} páginas
        </span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-surface-strong overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {total && (
        <input
          type="range"
          min={0}
          max={total}
          value={current ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none bg-surface-strong rounded-full cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
        />
      )}
    </div>
  )
}

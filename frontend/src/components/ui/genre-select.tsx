import { useState, useRef, useEffect, useMemo } from 'react'
import { useGenres } from '../../hooks/use-genres'

interface GenreSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
  minCount?: number
}

export default function GenreSelect({ value, onChange, minCount = 0 }: GenreSelectProps) {
  const { data: genres = [] } = useGenres()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return genres.filter((g) => !value.includes(g.id))
    return genres.filter(
      (g) =>
        !value.includes(g.id) &&
        g.name.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query, genres, value])

  function add(id: string) {
    onChange([...value, id])
    setQuery('')
    setOpen(false)
  }

  function remove(id: string) {
    if (value.length <= minCount) return
    onChange(value.filter((v) => v !== id))
  }

  const selected = genres.filter((g) => value.includes(g.id))

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-caption font-medium text-body-strong">
        Géneros
      </label>

      <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-md border border-hairline-strong bg-surface-card px-3 py-2 transition-colors focus-within:border-ink">
        {selected.map((genre) => (
          <span
            key={genre.id}
            className="inline-flex items-center gap-1 rounded-pill bg-surface-strong px-2.5 py-1 text-caption-uppercase text-ink"
          >
            {genre.name}
            <button
              type="button"
              onClick={() => remove(genre.id)}
              disabled={value.length <= minCount}
              className={`ml-0.5 leading-none transition-colors ${value.length <= minCount ? 'text-surface-strong cursor-not-allowed' : 'text-muted hover:text-ink'}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? 'Buscar géneros…' : ''}
          className="min-w-[100px] flex-1 border-none bg-transparent p-0 text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:ring-0"
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-hairline bg-surface-card shadow-sm">
          {filtered.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => {
                add(genre.id)
                setQuery('')
              }}
              className="w-full px-3 py-2 text-left text-body-md text-ink transition-colors hover:bg-surface-strong"
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

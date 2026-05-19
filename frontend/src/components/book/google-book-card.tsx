import type { GoogleBookItem } from '../../types/google-books'
import { Button } from '../ui'

interface GoogleBookCardProps {
  book: GoogleBookItem
  onImport: (book: GoogleBookItem) => void
  importing: boolean
}

export default function GoogleBookCard({ book, onImport, importing }: GoogleBookCardProps) {
  const { volumeInfo } = book
  const thumbnail = volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://')
  const authors = volumeInfo.authors?.join(', ') ?? 'Autor desconocido'

  return (
    <div className="group rounded-xl border border-hairline bg-surface-card p-4 shadow-card transition-all hover:shadow-md">
      <div className="flex gap-4">
        <div className="shrink-0 w-16 h-24 bg-surface-strong rounded-md overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={volumeInfo.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-soft">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-title-sm text-ink truncate">{volumeInfo.title}</h3>
          <p className="text-body-sm text-muted mt-0.5 truncate">{authors}</p>

          {volumeInfo.pageCount && (
            <p className="text-caption text-muted-soft mt-1.5">
              {volumeInfo.pageCount} páginas
              {volumeInfo.publishedDate && ` · ${volumeInfo.publishedDate}`}
            </p>
          )}

          {volumeInfo.description && (
            <p className="text-caption text-muted mt-2 line-clamp-2 leading-relaxed">
              {volumeInfo.description.replace(/<[^>]*>/g, '')}
            </p>
          )}

          <div className="mt-3">
            <Button size="sm" onClick={() => onImport(book)} disabled={importing}>
              {importing ? 'Importando…' : 'Importar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

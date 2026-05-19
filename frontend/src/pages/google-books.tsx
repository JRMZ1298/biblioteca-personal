import { useState, useCallback } from 'react'
import { useDebounce } from '../hooks/use-debounce'
import { useGoogleBooksSearch } from '../hooks/use-google-books'
import { useCreateBook } from '../hooks/use-books'
import GoogleBookCard from '../components/book/google-book-card'
import { Spinner, EmptyState, Input } from '../components/ui'
import { toastSuccess, toastError } from '../lib/toast'
import type { GoogleBookItem } from '../types/google-books'

export default function GoogleBooksPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)
  const [importingIds, setImportingIds] = useState<Set<string>>(new Set())

  const { data, isLoading, isFetching } = useGoogleBooksSearch(debouncedQuery)
  const createBook = useCreateBook()

  const handleImport = useCallback(
    async (book: GoogleBookItem) => {
      const id = book.id
      setImportingIds((prev) => new Set(prev).add(id))
      const { volumeInfo } = book
      try {
        await createBook.mutateAsync({
          title: volumeInfo.title,
          author: volumeInfo.authors?.join(', ') ?? 'Autor desconocido',
          description: volumeInfo.description?.replace(/<[^>]*>/g, '') || undefined,
          thumbnail: volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || undefined,
          pages: volumeInfo.pageCount,
          published_date: volumeInfo.publishedDate,
          google_books_id: id,
        })
        toastSuccess(`"${volumeInfo.title}" importado`)
      } catch {
        toastError(`Error al importar "${volumeInfo.title}"`)
      } finally {
        setImportingIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    },
    [createBook],
  )

  const results = data?.items ?? []
  const showLoading = isLoading || (isFetching && debouncedQuery.length >= 2)

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-6 lg:py-8">
      <h1 className="font-display text-display-sm text-ink mb-6">
        Buscar en Google Books
      </h1>

      <div className="max-w-md mb-6">
        <Input
          placeholder="Buscar por título o autor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {showLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : debouncedQuery.length >= 2 && results.length === 0 && !isFetching ? (
        <EmptyState
          title="Sin resultados"
          description="No encontramos libros para esa búsqueda. Intenta con otro término."
        />
      ) : query.length === 0 ? (
        <EmptyState
          title="Busca libros"
          description="Escribe el título o autor de un libro para buscar en Google Books e importarlo a tu biblioteca."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((book) => (
            <GoogleBookCard
              key={book.id}
              book={book}
              onImport={handleImport}
              importing={importingIds.has(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

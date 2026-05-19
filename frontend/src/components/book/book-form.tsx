import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookSchema, type BookFormData } from '../../lib/validations'
import { useCreateBook } from '../../hooks/use-books'
import { toastSuccess, toastError } from '../../lib/toast'
import { Button, Input, GenreSelect } from '../ui'

interface BookFormProps {
  onClose: () => void
}

export default function BookForm({ onClose }: BookFormProps) {
  const [genreIds, setGenreIds] = useState<string[]>([])
  const createBook = useCreateBook()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  })

  const onSubmit = async (data: BookFormData) => {
    if (genreIds.length === 0) return
    const pages = data.pages ? parseInt(data.pages, 10) : undefined
    if (data.pages && (isNaN(pages!) || pages! <= 0)) return
    try {
      await createBook.mutateAsync({ ...data, pages, genre_ids: genreIds })
      toastSuccess('Libro agregado a tu biblioteca')
      onClose()
    } catch {
      toastError('Error al agregar libro')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título"
        placeholder="Cien años de soledad"
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label="Autor"
        placeholder="Gabriel García Márquez"
        error={errors.author?.message}
        {...register('author')}
      />
      <Input
        label="Portada (URL)"
        placeholder="https://..."
        error={errors.thumbnail?.message}
        {...register('thumbnail')}
      />
      <Input
        label="Páginas"
        type="number"
        placeholder="496"
        error={errors.pages?.message}
        {...register('pages')}
      />
      <Input
        label="Fecha de publicación"
        type="date"
        error={errors.published_date?.message}
        {...register('published_date')}
      />

      <GenreSelect value={genreIds} onChange={setGenreIds} minCount={1} />
      {genreIds.length === 0 && (
        <p className="text-caption text-red-500 mt-0.5">
          Selecciona al menos un género
        </p>
      )}

      <div>
        <label className="mb-1 block text-caption font-medium text-body-strong">
          Descripción
        </label>
        <textarea
          className="block w-full rounded-md border border-hairline-strong px-4 py-3 text-body-md text-ink shadow-sm transition-colors placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-0 min-h-[80px] resize-y"
          placeholder="Breve reseña del libro…"
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || genreIds.length === 0}>
          {isSubmitting ? 'Guardando…' : 'Agregar libro'}
        </Button>
      </div>
    </form>
  )
}

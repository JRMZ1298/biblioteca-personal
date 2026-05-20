import { useState } from 'react'
import type { Note } from '../../types/book'

interface NotesProps {
  notes: Note[]
  totalPages: number
  onCreate: (data: { content: string; page_number: number | null }) => void
  onDelete: (noteId: string) => void
  isPending: boolean
}

export default function Notes({ notes, totalPages, onCreate, onDelete, isPending }: NotesProps) {
  const [content, setContent] = useState('')
  const [pageNumber, setPageNumber] = useState('')

  const handleSubmit = () => {
    if (!content.trim()) return
    onCreate({
      content: content.trim(),
      page_number: pageNumber ? parseInt(pageNumber, 10) : null,
    })
    setContent('')
    setPageNumber('')
  }

  return (
    <div className="space-y-3">
      <span className="text-caption font-medium text-body-strong block">Notas</span>

      <div className="space-y-2">
        {notes.length === 0 && (
          <p className="text-body-sm text-muted">Sin notas aún. Agrega una nota sobre este libro.</p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-lg border border-hairline bg-surface-card p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-body-sm text-ink flex-1 whitespace-pre-wrap">{note.content}</p>
              <button
                type="button"
                onClick={() => onDelete(note.id)}
                className="shrink-0 text-muted hover:text-red-500 transition-colors text-sm leading-none mt-0.5"
              >
                &times;
              </button>
            </div>
            {note.page_number && (
              <span className="text-caption text-muted-soft mt-1 block">
                Pág. {note.page_number}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe una nota…"
          className="flex-1 rounded-md border border-hairline-strong bg-surface-card px-3 py-2 text-body-sm text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
        />
        {totalPages > 0 && (
          <input
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            placeholder="Pág."
            min={1}
            max={totalPages}
            className="w-16 rounded-md border border-hairline-strong bg-surface-card px-2 py-2 text-body-sm text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink text-center"
          />
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || isPending}
          className="shrink-0 rounded-md bg-primary px-3 py-2 text-body-sm font-medium text-white transition-colors hover:bg-primary-strong disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '…' : '+'}
        </button>
      </div>
    </div>
  )
}

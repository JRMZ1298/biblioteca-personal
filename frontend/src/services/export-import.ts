import api from './api'
import type { ImportPreviewResponse } from '../types/import-export'

export async function exportBooks(format: 'json' | 'csv'): Promise<Blob> {
  const res = await api.get('/books/export', {
    params: { format },
    responseType: 'blob',
  })
  return res.data
}

export async function previewImport(file: File): Promise<ImportPreviewResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post('/books/import/preview', form)
  return res.data
}

export async function importBook(data: {
  title: string
  author: string
  description?: string
  thumbnail?: string
  pages?: number
  published_date?: string
  google_books_id?: string
  genre_ids?: string[]
  status?: string
  current_page?: number
  rating?: number
  started_at?: string
  finished_at?: string
}) {
  const res = await api.post('/books', data)
  return res.data
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

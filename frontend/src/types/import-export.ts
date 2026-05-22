export interface ExportBook {
  title: string
  author: string
  description: string | null
  thumbnail: string | null
  pages: number | null
  published_date: string | null
  google_books_id: string | null
  genres: string[]
  status: string
  current_page: number | null
  rating: number | null
  started_at: string | null
  finished_at: string | null
  notes: { content: string; page_number: number | null }[]
}

export interface ExportPayload {
  version: number
  exported_at: string | null
  books: ExportBook[]
}

export interface ImportPreviewBook {
  row: number
  title: string
  author: string
  exists: boolean
  reason: string
}

export interface ImportPreviewResponse {
  total: number
  books: ImportPreviewBook[]
}

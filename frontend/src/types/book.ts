export type ReadingStatus = 'PENDING' | 'READING' | 'COMPLETED'

export interface Genre {
  id: string
  name: string
}

export interface Note {
  id: string
  user_book_id: string
  content: string
  page_number: number | null
  created_at: string
}

export interface Book {
  id: string
  title: string
  author: string
  description: string | null
  thumbnail: string | null
  pages: number | null
  published_date: string | null
  google_books_id: string | null
  created_at: string
  genres: Genre[]
}

export interface UserBook {
  id: string
  user_id: string
  book_id: string
  book: Book
  status: ReadingStatus
  current_page: number | null
  started_at: string | null
  finished_at: string | null
  rating: number | null
  notes: Note[]
  created_at: string
}

export interface CreateNoteRequest {
  content: string
  page_number?: number | null
}

export interface CreateBookRequest {
  title: string
  author: string
  description?: string
  thumbnail?: string
  pages?: number
  published_date?: string
  google_books_id?: string
  genre_ids?: string[]
}

export interface UpdateBookRequest {
  status?: ReadingStatus
  current_page?: number
  rating?: number
  started_at?: string
  finished_at?: string
  genre_ids?: string[]
}

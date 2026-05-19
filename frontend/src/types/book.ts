export type ReadingStatus = 'PENDING' | 'READING' | 'COMPLETED'

export interface Genre {
  id: string
  name: string
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
  notes: string | null
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
  notes?: string
  started_at?: string
  finished_at?: string
  genre_ids?: string[]
}
